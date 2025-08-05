#!/usr/bin/env python3
"""
Simple deployment script for MedAI Healthcare Platform
Serves the React build files using Python's built-in HTTP server
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

def main():
    # Change to frontend directory
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return
    
    # Check if build exists
    build_dir = frontend_dir / "build"
    if not build_dir.exists():
        print("❌ Build directory not found! Run 'npm run build' first.")
        return
    
    # Change to build directory
    os.chdir(build_dir)
    
    # Set up server
    PORT = 8080
    
    class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()
        
        def do_GET(self):
            # Handle React Router - serve index.html for all routes
            if not os.path.exists(self.path[1:]) and self.path != '/':
                self.path = '/'
            return super().do_GET()
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"🚀 MedAI Healthcare Platform is running!")
            print(f"📱 Local: http://localhost:{PORT}")
            print(f"🌐 Network: http://0.0.0.0:{PORT}")
            print(f"📊 Dashboard: http://localhost:{PORT}/patient-dashboard")
            print(f"🏥 Medical Records: http://localhost:{PORT}/medical-records")
            print(f"🔬 Symptom Checker: http://localhost:{PORT}/symptom-checker")
            print(f"📞 Video Calls: http://localhost:{PORT}/video-calls")
            print(f"💬 Chat: http://localhost:{PORT}/chat")
            print(f"📅 Appointments: http://localhost:{PORT}/appointments")
            print(f"👥 Patient Management: http://localhost:{PORT}/patient-management")
            print(f"📈 Analytics: http://localhost:{PORT}/analytics")
            print(f"🔒 Security: http://localhost:{PORT}/security-privacy")
            print(f"🤖 Advanced AI: http://localhost:{PORT}/advanced-ai")
            print(f"🚨 Crisis Dashboard: http://localhost:{PORT}/crisis-dashboard")
            print("\n✨ Features Available:")
            print("   • AI-Powered Medical Records Analysis")
            print("   • Bloodwork Analysis with Cancer Risk Assessment")
            print("   • X-ray AI Analysis with Doctor Notes")
            print("   • Medication Tracking and Life Impact Analysis")
            print("   • Vaccination Records and Missing Vaccines")
            print("   • Surgical Procedure Guides for Doctors")
            print("   • Symptom Checker with AI Diagnosis")
            print("   • Video Consultation Platform")
            print("   • Patient Management System")
            print("   • Analytics Dashboard")
            print("   • Security & Privacy Controls")
            print("   • Crisis Management Dashboard")
            print("\n🎯 Perfect for investors and demos!")
            print("Press Ctrl+C to stop the server")
            
            # Open browser
            webbrowser.open(f"http://localhost:{PORT}")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Thanks for using MedAI!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main() 