package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.Appointment;
import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.AppointmentRepository;
import com.aitelemedicine.telemedicine.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.SubscriptionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {

    @Value("${app.stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${app.stripe.publishable-key}")
    private String stripePublishableKey;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public PaymentService() {
        Stripe.apiKey = stripeSecretKey;
    }

    public Map<String, Object> createPaymentIntent(Long appointmentId, String customerEmail) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            // Create or get customer
            Customer customer = getOrCreateCustomer(customerEmail);

            // Create payment intent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) (appointment.getFee() * 100)) // Convert to cents
                    .setCurrency("usd")
                    .setCustomer(customer.getId())
                    .setDescription("Appointment with Dr. " + appointment.getDoctor().getLastName())
                    .setMetadata(Map.of(
                            "appointmentId", appointmentId.toString(),
                            "patientId", appointment.getPatient().getId().toString(),
                            "doctorId", appointment.getDoctor().getId().toString()
                    ))
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Update appointment with payment intent ID
            appointment.setStripePaymentIntentId(paymentIntent.getId());
            appointment.setPaymentStatus("PENDING");
            appointmentRepository.save(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());
            response.put("amount", appointment.getFee());
            response.put("currency", "usd");

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Payment creation failed: " + e.getMessage());
        }
    }

    public Map<String, Object> createSubscription(String customerEmail, String priceId) {
        try {
            Customer customer = getOrCreateCustomer(customerEmail);

            SubscriptionCreateParams params = SubscriptionCreateParams.builder()
                    .setCustomer(customer.getId())
                    .addItem(SubscriptionCreateParams.Item.builder()
                            .setPrice(priceId)
                            .build())
                    .build();

            Subscription subscription = Subscription.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("subscriptionId", subscription.getId());
            response.put("status", subscription.getStatus());
            response.put("currentPeriodEnd", subscription.getCurrentPeriodEnd());

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Subscription creation failed: " + e.getMessage());
        }
    }

    public void handlePaymentSuccess(String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            // Update appointment status
            String appointmentId = paymentIntent.getMetadata().get("appointmentId");
            if (appointmentId != null) {
                Appointment appointment = appointmentRepository.findById(Long.parseLong(appointmentId))
                        .orElseThrow(() -> new RuntimeException("Appointment not found"));

                appointment.setPaymentStatus("PAID");
                appointmentRepository.save(appointment);

                // Send confirmation email
                emailService.sendAppointmentConfirmation(
                    appointment.getPatient(),
                    appointment.getDoctor(),
                    appointment.getScheduledAt().toString()
                );
            }
        } catch (StripeException e) {
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    public void handlePaymentFailure(String paymentIntentId) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            // Update appointment status
            String appointmentId = paymentIntent.getMetadata().get("appointmentId");
            if (appointmentId != null) {
                Appointment appointment = appointmentRepository.findById(Long.parseLong(appointmentId))
                        .orElseThrow(() -> new RuntimeException("Appointment not found"));

                appointment.setPaymentStatus("FAILED");
                appointmentRepository.save(appointment);

                // Send failure notification
                emailService.sendPaymentFailureEmail(appointment.getPatient(), appointment);
            }
        } catch (StripeException e) {
            throw new RuntimeException("Payment failure handling failed: " + e.getMessage());
        }
    }

    public void handleSubscriptionCanceled(String subscriptionId) {
        try {
            Subscription subscription = Subscription.retrieve(subscriptionId);
            String customerEmail = subscription.getCustomer().toString();
            
            // Update user subscription status
            Optional<User> userOpt = userRepository.findByEmail(customerEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // Update user subscription status
                // user.setSubscriptionStatus("CANCELED");
                userRepository.save(user);
            }
        } catch (StripeException e) {
            throw new RuntimeException("Subscription cancellation handling failed: " + e.getMessage());
        }
    }

    public Map<String, Object> getCustomerPortalUrl(String customerEmail) {
        try {
            Customer customer = getOrCreateCustomer(customerEmail);
            
            Map<String, Object> params = new HashMap<>();
            params.put("customer", customer.getId());
            params.put("return_url", "https://your-domain.com/account");

            com.stripe.model.billingportal.Session session = 
                com.stripe.model.billingportal.Session.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("url", session.getUrl());
            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Customer portal creation failed: " + e.getMessage());
        }
    }

    public Map<String, Object> refundPayment(String paymentIntentId, Long amount) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            Map<String, Object> refundParams = new HashMap<>();
            if (amount != null) {
                refundParams.put("amount", amount);
            }

            com.stripe.model.Refund refund = com.stripe.model.Refund.create(refundParams);

            // Update appointment status
            String appointmentId = paymentIntent.getMetadata().get("appointmentId");
            if (appointmentId != null) {
                Appointment appointment = appointmentRepository.findById(Long.parseLong(appointmentId))
                        .orElseThrow(() -> new RuntimeException("Appointment not found"));

                appointment.setPaymentStatus("REFUNDED");
                appointmentRepository.save(appointment);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("refundId", refund.getId());
            response.put("status", refund.getStatus());
            response.put("amount", refund.getAmount());

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Refund failed: " + e.getMessage());
        }
    }

    public Map<String, Object> getPaymentMethods(String customerEmail) {
        try {
            Customer customer = getOrCreateCustomer(customerEmail);
            
            Map<String, Object> params = new HashMap<>();
            params.put("customer", customer.getId());
            params.put("type", "card");

            com.stripe.model.PaymentMethodCollection paymentMethods = 
                PaymentMethod.list(params);

            Map<String, Object> response = new HashMap<>();
            response.put("paymentMethods", paymentMethods.getData());
            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Payment methods retrieval failed: " + e.getMessage());
        }
    }

    public Map<String, Object> createSetupIntent(String customerEmail) {
        try {
            Customer customer = getOrCreateCustomer(customerEmail);
            
            Map<String, Object> params = new HashMap<>();
            params.put("customer", customer.getId());
            params.put("usage", "off_session");

            com.stripe.model.SetupIntent setupIntent = 
                com.stripe.model.SetupIntent.create(params);

            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", setupIntent.getClientSecret());
            response.put("setupIntentId", setupIntent.getId());

            return response;
        } catch (StripeException e) {
            throw new RuntimeException("Setup intent creation failed: " + e.getMessage());
        }
    }

    private Customer getOrCreateCustomer(String email) throws StripeException {
        // Try to find existing customer
        Map<String, Object> customerParams = new HashMap<>();
        customerParams.put("email", email);
        
        com.stripe.model.CustomerCollection customers = Customer.list(customerParams);
        
        if (!customers.getData().isEmpty()) {
            return customers.getData().get(0);
        }

        // Create new customer
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(email)
                .build();

        return Customer.create(params);
    }

    public Map<String, Object> getPricingPlans() {
        Map<String, Object> plans = new HashMap<>();
        
        // Basic Plan
        Map<String, Object> basicPlan = new HashMap<>();
        basicPlan.put("id", "price_basic_monthly");
        basicPlan.put("name", "Basic Plan");
        basicPlan.put("price", 29.99);
        basicPlan.put("features", new String[]{
            "5 consultations per month",
            "Basic AI symptom checker",
            "Email support"
        });
        plans.put("basic", basicPlan);

        // Premium Plan
        Map<String, Object> premiumPlan = new HashMap<>();
        premiumPlan.put("id", "price_premium_monthly");
        premiumPlan.put("name", "Premium Plan");
        premiumPlan.put("price", 79.99);
        premiumPlan.put("features", new String[]{
            "Unlimited consultations",
            "Advanced AI features",
            "Priority support",
            "Medical record storage",
            "Video consultations"
        });
        plans.put("premium", premiumPlan);

        // Enterprise Plan
        Map<String, Object> enterprisePlan = new HashMap<>();
        enterprisePlan.put("id", "price_enterprise_monthly");
        enterprisePlan.put("name", "Enterprise Plan");
        enterprisePlan.put("price", 199.99);
        enterprisePlan.put("features", new String[]{
            "Everything in Premium",
            "Custom integrations",
            "Dedicated support",
            "Advanced analytics",
            "White-label options"
        });
        plans.put("enterprise", enterprisePlan);

        return plans;
    }
} 