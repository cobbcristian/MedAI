import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
import openai
from openai import AsyncOpenAI
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class NoteContext:
    """Context for note editing assistance"""
    patient_id: str
    visit_date: datetime
    chief_complaint: str
    symptoms: List[str]
    vital_signs: Dict[str, Any]
    physical_exam: str
    lab_results: Dict[str, Any]
    scan_results: Dict[str, Any]
    current_medications: List[str]
    allergies: List[str]
    medical_history: str
    family_history: str
    social_history: str

@dataclass
class CopilotSuggestion:
    """Represents a copilot suggestion"""
    suggestion_type: str  # "soap_note", "lab_suggestions", "diagnosis", "patient_explanation", "follow_up"
    content: str
    confidence: float
    reasoning: str
    alternatives: List[str] = None
    references: List[str] = None

class DoctorCopilotService:
    """
    AI Copilot for Doctors - GPT-style assistant for clinical documentation
    and decision support
    """
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model_version = "v1.4.2"
        self.max_tokens = 2000
        self.temperature = 0.3  # Lower temperature for more consistent medical advice
        
        # Medical knowledge base references
        self.medical_references = {
            "icd10": "ICD-10-CM coding guidelines",
            "cpt": "CPT coding guidelines", 
            "soap": "SOAP note documentation standards",
            "clinical_guidelines": "Evidence-based clinical practice guidelines"
        }
        
        logger.info("DoctorCopilotService initialized")
    
    async def generate_soap_note(
        self,
        context: NoteContext,
        doctor_notes: str = None,
        style_preference: str = "comprehensive"
    ) -> CopilotSuggestion:
        """
        Generate structured SOAP note from doctor's free text and patient data
        """
        try:
            # Prepare context for SOAP note generation
            context_prompt = self._prepare_soap_context(context, doctor_notes)
            
            # Generate SOAP note using GPT
            soap_prompt = f"""
            As a medical AI assistant, generate a comprehensive SOAP note based on the following information:
            
            {context_prompt}
            
            Style preference: {style_preference}
            
            Please structure the response as:
            
            SUBJECTIVE:
            - Chief complaint
            - History of present illness
            - Review of systems
            - Past medical history
            - Medications and allergies
            - Social and family history
            
            OBJECTIVE:
            - Vital signs
            - Physical examination findings
            - Lab results
            - Imaging results
            
            ASSESSMENT:
            - Primary diagnosis
            - Differential diagnoses
            - Problem list
            
            PLAN:
            - Treatment plan
            - Medications
            - Follow-up recommendations
            - Patient education
            
            Ensure the note is:
            1. Clinically accurate and evidence-based
            2. Well-structured and professional
            3. Complete and comprehensive
            4. Appropriate for medical documentation
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": soap_prompt}],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            soap_content = response.choices[0].message.content
            
            # Generate confidence score based on available information
            confidence = self._calculate_soap_confidence(context)
            
            return CopilotSuggestion(
                suggestion_type="soap_note",
                content=soap_content,
                confidence=confidence,
                reasoning="Generated based on patient data, symptoms, and clinical context",
                alternatives=await self._generate_soap_alternatives(context, style_preference),
                references=[self.medical_references["soap"]]
            )
            
        except Exception as e:
            logger.error(f"Error generating SOAP note: {e}")
            raise
    
    async def suggest_lab_tests(
        self,
        context: NoteContext,
        suspected_conditions: List[str] = None
    ) -> CopilotSuggestion:
        """
        Suggest relevant laboratory tests based on symptoms and clinical context
        """
        try:
            # Prepare lab suggestion prompt
            lab_prompt = f"""
            As a medical AI assistant, suggest appropriate laboratory tests based on the following clinical information:
            
            Patient Information:
            - Chief complaint: {context.chief_complaint}
            - Symptoms: {', '.join(context.symptoms)}
            - Vital signs: {json.dumps(context.vital_signs)}
            - Physical exam findings: {context.physical_exam}
            - Current medications: {', '.join(context.current_medications)}
            - Allergies: {', '.join(context.allergies)}
            - Medical history: {context.medical_history}
            
            Suspected conditions: {', '.join(suspected_conditions) if suspected_conditions else 'Not specified'}
            
            Please suggest laboratory tests that are:
            1. Clinically indicated based on symptoms and presentation
            2. Evidence-based and guideline-recommended
            3. Cost-effective and appropriate for the clinical setting
            4. Prioritized by urgency and clinical importance
            
            For each suggested test, provide:
            - Test name and code
            - Clinical rationale
            - Expected results interpretation
            - Urgency level (routine, urgent, stat)
            
            Organize suggestions by:
            - Essential tests (must have)
            - Recommended tests (should have)
            - Optional tests (consider if resources allow)
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": lab_prompt}],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            lab_suggestions = response.choices[0].message.content
            
            # Calculate confidence based on available clinical information
            confidence = self._calculate_lab_confidence(context, suspected_conditions)
            
            return CopilotSuggestion(
                suggestion_type="lab_suggestions",
                content=lab_suggestions,
                confidence=confidence,
                reasoning="Based on symptoms, clinical presentation, and evidence-based guidelines",
                alternatives=await self._generate_lab_alternatives(context, suspected_conditions),
                references=[self.medical_references["clinical_guidelines"]]
            )
            
        except Exception as e:
            logger.error(f"Error suggesting lab tests: {e}")
            raise
    
    async def suggest_diagnosis(
        self,
        context: NoteContext,
        include_differential: bool = True,
        include_confidence: bool = True
    ) -> CopilotSuggestion:
        """
        Suggest primary diagnosis and differential diagnoses
        """
        try:
            # Prepare diagnosis suggestion prompt
            diagnosis_prompt = f"""
            As a medical AI assistant, provide diagnostic suggestions based on the following clinical information:
            
            Patient Information:
            - Chief complaint: {context.chief_complaint}
            - Symptoms: {', '.join(context.symptoms)}
            - Vital signs: {json.dumps(context.vital_signs)}
            - Physical exam findings: {context.physical_exam}
            - Lab results: {json.dumps(context.lab_results)}
            - Imaging results: {json.dumps(context.scan_results)}
            - Medical history: {context.medical_history}
            - Current medications: {', '.join(context.current_medications)}
            
            Please provide:
            1. Primary diagnosis with confidence level
            2. Differential diagnoses (top 3-5 alternatives)
            3. Clinical reasoning for each diagnosis
            4. Red flags or concerning features
            5. Recommended next steps for confirmation
            
            Focus on:
            - Evidence-based diagnostic criteria
            - Clinical presentation patterns
            - Risk factors and comorbidities
            - Age and gender-specific considerations
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": diagnosis_prompt}],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            diagnosis_suggestions = response.choices[0].message.content
            
            # Calculate overall confidence
            confidence = self._calculate_diagnosis_confidence(context)
            
            return CopilotSuggestion(
                suggestion_type="diagnosis",
                content=diagnosis_suggestions,
                confidence=confidence,
                reasoning="Based on clinical presentation, lab results, and evidence-based diagnostic criteria",
                alternatives=await self._generate_diagnosis_alternatives(context),
                references=[self.medical_references["clinical_guidelines"]]
            )
            
        except Exception as e:
            logger.error(f"Error suggesting diagnosis: {e}")
            raise
    
    async def explain_diagnosis_to_patient(
        self,
        diagnosis: str,
        context: NoteContext,
        education_level: str = "high_school",
        language: str = "English"
    ) -> CopilotSuggestion:
        """
        Generate patient-friendly explanation of diagnosis
        """
        try:
            # Prepare patient explanation prompt
            explanation_prompt = f"""
            As a medical AI assistant, explain the following diagnosis to a patient in simple, understandable terms:
            
            Diagnosis: {diagnosis}
            
            Patient Context:
            - Chief complaint: {context.chief_complaint}
            - Symptoms: {', '.join(context.symptoms)}
            - Age and relevant history: {context.medical_history}
            
            Education level: {education_level}
            Language: {language}
            
            Please provide an explanation that includes:
            1. What the diagnosis means in simple terms
            2. What caused this condition (if known)
            3. What symptoms to expect
            4. How it will be treated
            5. What the patient can do to help themselves
            6. When to seek immediate medical attention
            7. What to expect in terms of recovery
            
            Guidelines:
            - Use simple, non-medical language
            - Avoid jargon and complex medical terms
            - Be encouraging but realistic
            - Include practical advice
            - Address common concerns and fears
            - Provide hope and positive outlook when appropriate
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": explanation_prompt}],
                max_tokens=self.max_tokens,
                temperature=0.7  # Slightly higher for more natural patient communication
            )
            
            patient_explanation = response.choices[0].message.content
            
            return CopilotSuggestion(
                suggestion_type="patient_explanation",
                content=patient_explanation,
                confidence=0.9,  # High confidence for patient communication
                reasoning="Tailored for patient education level and language preference",
                alternatives=await self._generate_explanation_alternatives(diagnosis, context, education_level),
                references=["Patient education guidelines", "Health literacy best practices"]
            )
            
        except Exception as e:
            logger.error(f"Error explaining diagnosis to patient: {e}")
            raise
    
    async def suggest_follow_up_plan(
        self,
        context: NoteContext,
        diagnosis: str,
        treatment_initiated: List[str] = None
    ) -> CopilotSuggestion:
        """
        Suggest follow-up plan and monitoring recommendations
        """
        try:
            # Prepare follow-up suggestion prompt
            followup_prompt = f"""
            As a medical AI assistant, suggest a comprehensive follow-up plan for the following case:
            
            Patient Information:
            - Diagnosis: {diagnosis}
            - Chief complaint: {context.chief_complaint}
            - Treatment initiated: {', '.join(treatment_initiated) if treatment_initiated else 'None specified'}
            - Medical history: {context.medical_history}
            - Current medications: {', '.join(context.current_medications)}
            
            Please provide a follow-up plan that includes:
            1. Recommended follow-up timeline
            2. Monitoring parameters to track
            3. Signs and symptoms to watch for
            4. When to return for follow-up
            5. When to seek immediate medical attention
            6. Lifestyle modifications if applicable
            7. Medication monitoring if applicable
            8. Referral recommendations if needed
            
            Consider:
            - Standard of care for the diagnosis
            - Patient's individual risk factors
            - Treatment response monitoring
            - Prevention of complications
            - Patient education needs
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": followup_prompt}],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            followup_plan = response.choices[0].message.content
            
            return CopilotSuggestion(
                suggestion_type="follow_up",
                content=followup_plan,
                confidence=0.85,
                reasoning="Based on diagnosis, treatment plan, and standard follow-up protocols",
                alternatives=await self._generate_followup_alternatives(context, diagnosis, treatment_initiated),
                references=[self.medical_references["clinical_guidelines"]]
            )
            
        except Exception as e:
            logger.error(f"Error suggesting follow-up plan: {e}")
            raise
    
    async def summarize_visit(
        self,
        context: NoteContext,
        doctor_notes: str,
        summary_type: str = "comprehensive"
    ) -> CopilotSuggestion:
        """
        Summarize the patient visit for documentation
        """
        try:
            # Prepare summary prompt
            summary_prompt = f"""
            As a medical AI assistant, create a {summary_type} summary of the following patient visit:
            
            Visit Information:
            - Date: {context.visit_date}
            - Chief complaint: {context.chief_complaint}
            - Doctor's notes: {doctor_notes}
            
            Patient Data:
            - Symptoms: {', '.join(context.symptoms)}
            - Vital signs: {json.dumps(context.vital_signs)}
            - Physical exam: {context.physical_exam}
            - Lab results: {json.dumps(context.lab_results)}
            - Imaging: {json.dumps(context.scan_results)}
            
            Please create a {summary_type} summary that includes:
            1. Key findings and observations
            2. Clinical decisions made
            3. Treatment plan initiated
            4. Follow-up recommendations
            5. Important patient education provided
            6. Any concerns or red flags identified
            
            Style: Professional, concise, and clinically relevant
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": summary_prompt}],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            visit_summary = response.choices[0].message.content
            
            return CopilotSuggestion(
                suggestion_type="visit_summary",
                content=visit_summary,
                confidence=0.9,
                reasoning="Based on comprehensive visit data and doctor's notes",
                alternatives=await self._generate_summary_alternatives(context, doctor_notes, summary_type),
                references=[self.medical_references["soap"]]
            )
            
        except Exception as e:
            logger.error(f"Error summarizing visit: {e}")
            raise
    
    async def suggest_cpt_codes(
        self,
        context: NoteContext,
        procedures_performed: List[str] = None,
        visit_complexity: str = "moderate"
    ) -> CopilotSuggestion:
        """
        Suggest appropriate CPT codes for billing
        """
        try:
            # Prepare CPT suggestion prompt
            cpt_prompt = f"""
            As a medical AI assistant, suggest appropriate CPT codes for the following visit:
            
            Visit Information:
            - Chief complaint: {context.chief_complaint}
            - Visit complexity: {visit_complexity}
            - Procedures performed: {', '.join(procedures_performed) if procedures_performed else 'None specified'}
            - Physical exam findings: {context.physical_exam}
            - Lab tests ordered: {json.dumps(context.lab_results)}
            - Imaging ordered: {json.dumps(context.scan_results)}
            
            Please suggest CPT codes for:
            1. Evaluation and Management (E&M) codes based on visit complexity
            2. Procedure codes if any procedures were performed
            3. Lab test codes for ordered tests
            4. Imaging codes for ordered studies
            
            For each code, provide:
            - CPT code and description
            - Documentation requirements
            - Modifiers if applicable
            - Rationale for code selection
            
            Ensure compliance with:
            - CPT coding guidelines
            - Documentation requirements
            - Medical necessity criteria
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": cpt_prompt}],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            cpt_suggestions = response.choices[0].message.content
            
            return CopilotSuggestion(
                suggestion_type="cpt_codes",
                content=cpt_suggestions,
                confidence=0.8,
                reasoning="Based on visit complexity, procedures, and CPT coding guidelines",
                alternatives=await self._generate_cpt_alternatives(context, procedures_performed, visit_complexity),
                references=[self.medical_references["cpt"]]
            )
            
        except Exception as e:
            logger.error(f"Error suggesting CPT codes: {e}")
            raise
    
    def _prepare_soap_context(self, context: NoteContext, doctor_notes: str = None) -> str:
        """Prepare context string for SOAP note generation"""
        context_str = f"""
        Patient ID: {context.patient_id}
        Visit Date: {context.visit_date}
        
        Chief Complaint: {context.chief_complaint}
        Symptoms: {', '.join(context.symptoms)}
        
        Vital Signs: {json.dumps(context.vital_signs)}
        Physical Examination: {context.physical_exam}
        
        Lab Results: {json.dumps(context.lab_results)}
        Imaging Results: {json.dumps(context.scan_results)}
        
        Current Medications: {', '.join(context.current_medications)}
        Allergies: {', '.join(context.allergies)}
        
        Medical History: {context.medical_history}
        Family History: {context.family_history}
        Social History: {context.social_history}
        """
        
        if doctor_notes:
            context_str += f"\nDoctor's Notes: {doctor_notes}"
        
        return context_str
    
    def _calculate_soap_confidence(self, context: NoteContext) -> float:
        """Calculate confidence score for SOAP note generation"""
        confidence = 0.5  # Base confidence
        
        # Add confidence based on available information
        if context.chief_complaint:
            confidence += 0.1
        if context.symptoms:
            confidence += 0.1
        if context.vital_signs:
            confidence += 0.1
        if context.physical_exam:
            confidence += 0.1
        if context.lab_results:
            confidence += 0.1
        if context.medical_history:
            confidence += 0.1
        
        return min(confidence, 0.95)  # Cap at 95%
    
    def _calculate_lab_confidence(self, context: NoteContext, suspected_conditions: List[str] = None) -> float:
        """Calculate confidence score for lab suggestions"""
        confidence = 0.6  # Base confidence for lab suggestions
        
        if context.symptoms:
            confidence += 0.1
        if context.chief_complaint:
            confidence += 0.1
        if suspected_conditions:
            confidence += 0.1
        if context.medical_history:
            confidence += 0.1
        
        return min(confidence, 0.9)
    
    def _calculate_diagnosis_confidence(self, context: NoteContext) -> float:
        """Calculate confidence score for diagnosis suggestions"""
        confidence = 0.5  # Base confidence
        
        if context.symptoms:
            confidence += 0.1
        if context.physical_exam:
            confidence += 0.1
        if context.lab_results:
            confidence += 0.1
        if context.scan_results:
            confidence += 0.1
        if context.medical_history:
            confidence += 0.1
        
        return min(confidence, 0.85)  # Cap at 85% for diagnosis suggestions
    
    async def _generate_soap_alternatives(self, context: NoteContext, style_preference: str) -> List[str]:
        """Generate alternative SOAP note styles"""
        alternatives = []
        
        # Generate different style alternatives
        styles = ["concise", "detailed", "problem-focused", "comprehensive"]
        for style in styles:
            if style != style_preference:
                try:
                    alt_prompt = f"Generate a {style} SOAP note for the same patient case"
                    response = await self.client.chat.completions.create(
                        model="gpt-4",
                        messages=[{"role": "user", "content": alt_prompt}],
                        max_tokens=1000,
                        temperature=self.temperature
                    )
                    alternatives.append(f"{style.capitalize()} style: {response.choices[0].message.content[:200]}...")
                except Exception as e:
                    logger.error(f"Error generating {style} alternative: {e}")
        
        return alternatives
    
    async def _generate_lab_alternatives(self, context: NoteContext, suspected_conditions: List[str] = None) -> List[str]:
        """Generate alternative lab test suggestions"""
        alternatives = []
        
        # Generate conservative vs comprehensive alternatives
        approaches = ["conservative", "comprehensive", "minimal"]
        
        for approach in approaches:
            try:
                alt_prompt = f"Suggest {approach} lab tests for the same clinical scenario"
                response = await self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": alt_prompt}],
                    max_tokens=500,
                    temperature=self.temperature
                )
                alternatives.append(f"{approach.capitalize()} approach: {response.choices[0].message.content[:150]}...")
            except Exception as e:
                logger.error(f"Error generating {approach} lab alternative: {e}")
        
        return alternatives
    
    async def _generate_diagnosis_alternatives(self, context: NoteContext) -> List[str]:
        """Generate alternative diagnostic approaches"""
        alternatives = []
        
        # Generate different diagnostic perspectives
        perspectives = ["differential diagnosis", "working diagnosis", "rule-out approach"]
        
        for perspective in perspectives:
            try:
                alt_prompt = f"Provide {perspective} for the same clinical presentation"
                response = await self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": alt_prompt}],
                    max_tokens=500,
                    temperature=self.temperature
                )
                alternatives.append(f"{perspective.replace('_', ' ').title()}: {response.choices[0].message.content[:150]}...")
            except Exception as e:
                logger.error(f"Error generating {perspective} alternative: {e}")
        
        return alternatives
    
    async def _generate_explanation_alternatives(
        self,
        diagnosis: str,
        context: NoteContext,
        education_level: str
    ) -> List[str]:
        """Generate alternative patient explanations"""
        alternatives = []
        
        # Generate explanations for different education levels
        levels = ["elementary", "high_school", "college"]
        for level in levels:
            if level != education_level:
                try:
                    alt_prompt = f"Explain {diagnosis} to a patient with {level} education level"
                    response = await self.client.chat.completions.create(
                        model="gpt-4",
                        messages=[{"role": "user", "content": alt_prompt}],
                        max_tokens=300,
                        temperature=0.7
                    )
                    alternatives.append(f"{level.replace('_', ' ').title()} level: {response.choices[0].message.content[:100]}...")
                except Exception as e:
                    logger.error(f"Error generating {level} explanation alternative: {e}")
        
        return alternatives
    
    async def _generate_followup_alternatives(
        self,
        context: NoteContext,
        diagnosis: str,
        treatment_initiated: List[str] = None
    ) -> List[str]:
        """Generate alternative follow-up plans"""
        alternatives = []
        
        # Generate different follow-up approaches
        approaches = ["conservative", "aggressive", "standard"]
        
        for approach in approaches:
            try:
                alt_prompt = f"Suggest {approach} follow-up plan for {diagnosis}"
                response = await self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": alt_prompt}],
                    max_tokens=400,
                    temperature=self.temperature
                )
                alternatives.append(f"{approach.capitalize()} approach: {response.choices[0].message.content[:100]}...")
            except Exception as e:
                logger.error(f"Error generating {approach} follow-up alternative: {e}")
        
        return alternatives
    
    async def _generate_summary_alternatives(
        self,
        context: NoteContext,
        doctor_notes: str,
        summary_type: str
    ) -> List[str]:
        """Generate alternative visit summaries"""
        alternatives = []
        
        # Generate different summary types
        types = ["brief", "detailed", "problem-focused", "comprehensive"]
        for summary_type_alt in types:
            if summary_type_alt != summary_type:
                try:
                    alt_prompt = f"Generate {summary_type_alt} visit summary"
                    response = await self.client.chat.completions.create(
                        model="gpt-4",
                        messages=[{"role": "user", "content": alt_prompt}],
                        max_tokens=500,
                        temperature=self.temperature
                    )
                    alternatives.append(f"{summary_type_alt.capitalize()} summary: {response.choices[0].message.content[:100]}...")
                except Exception as e:
                    logger.error(f"Error generating {summary_type_alt} summary alternative: {e}")
        
        return alternatives
    
    async def _generate_cpt_alternatives(
        self,
        context: NoteContext,
        procedures_performed: List[str] = None,
        visit_complexity: str = None
    ) -> List[str]:
        """Generate alternative CPT code suggestions"""
        alternatives = []
        
        # Generate alternatives for different complexity levels
        complexities = ["low", "moderate", "high"]
        for complexity in complexities:
            if complexity != visit_complexity:
                try:
                    alt_prompt = f"Suggest CPT codes for {complexity} complexity visit"
                    response = await self.client.chat.completions.create(
                        model="gpt-4",
                        messages=[{"role": "user", "content": alt_prompt}],
                        max_tokens=400,
                        temperature=self.temperature
                    )
                    alternatives.append(f"{complexity.capitalize()} complexity: {response.choices[0].message.content[:100]}...")
                except Exception as e:
                    logger.error(f"Error generating {complexity} CPT alternative: {e}")
        
        return alternatives
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of the copilot service"""
        return {
            "model_version": self.model_version,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "available_functions": [
                "generate_soap_note",
                "suggest_lab_tests", 
                "suggest_diagnosis",
                "explain_diagnosis_to_patient",
                "suggest_follow_up_plan",
                "summarize_visit",
                "suggest_cpt_codes"
            ],
            "last_updated": datetime.now().isoformat()
        } 