'use client'

import { useState } from 'react'
import React from 'react'

const CompletedStep = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-green-800 mb-1">{title}</h4>
          <p className="text-sm text-green-700">{description}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

const Stepper = ({ currentStep, completedSteps, stepResults }: { currentStep: number, completedSteps: {[key: number]: any}, stepResults: {[key: number]: any} }) => {
  const steps = [
    { title: 'Connect Account', description: 'Link your Gmail account' },
    { title: 'Fetch Email', description: 'Fetch email content' },
    { title: 'Get Started', description: 'Complete setup' }
  ]
  
  return (
    <div className="w-full max-w-md mx-auto mb-12">
      <div className="space-y-96">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-semibold border-2 ${
                  index + 1 <= currentStep 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : index + 1 === currentStep + 1
                    ? 'bg-white text-blue-600 border-blue-600'
                    : 'bg-gray-100 text-gray-400 border-gray-200'
                }`}>
                  {index + 1 < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-96 mt-2 ${
                    index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              <div className="flex-1 pt-2">
                <h3 className={`text-lg font-semibold ${
                  index + 1 <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  index + 1 <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
            
            {/* Completion boxes directly under the step number */}
            {completedSteps[index + 1] && (
              <div className="ml-6 mt-4" style={{ marginLeft: '3rem' }}>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 w-64">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">
                        {index + 1 === 1 && "Connected to Google"}
                        {index + 1 === 2 && stepResults[2] && `Email: "${stepResults[2].email.subject}"`}
                        {index + 1 === 3 && "Setup Complete"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const Step1 = ({ onNext, loading, isCompleted, authLinkLoading, identifierLoading }: { onNext: (data: any) => void, loading: boolean, isCompleted: boolean, authLinkLoading: boolean, identifierLoading: boolean }) => {
  const handleGmailConnect = () => {
    onNext({ provider: 'gmail' })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-10 w-full text-center relative">
      {/* Gmail logo at top left */}
      <div className="absolute top-6 left-6">
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-2">Connect Your Gmail</h3>
      <p className="text-gray-600 mb-8">
        Connect your Gmail account to get started with Scalekit
      </p>
      
      {!isCompleted ? (
        <button
          onClick={handleGmailConnect}
          disabled={loading || authLinkLoading || identifierLoading}
          className="flex items-center justify-center w-full bg-white border-2 border-gray-300 hover:border-gray-400 py-4 px-6 rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-700 font-medium">
            {identifierLoading ? 'Initializing...' : authLinkLoading ? 'Preparing connection...' : loading ? 'Waiting for Gmail authorization...' : 'Connect with Gmail'}
          </span>
        </button>
      ) : (
        <div className="flex items-center justify-center w-full bg-green-50 border-2 border-green-200 py-4 px-6 rounded-lg">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-green-700 font-medium">Connected to Gmail</span>
        </div>
      )}
      
      {!isCompleted && !loading && (
        <p className="text-xs text-gray-500 mt-4">
          We'll redirect you to Gmail to authorize access
        </p>
      )}
      {loading && (
        <p className="text-sm text-blue-600 mt-4">
          Please complete authorization in the new tab that opened. We're waiting for confirmation...
        </p>
      )}
    </div>
  )
}

const Step2 = ({ onFetch, loading, isCompleted, emailData }: { onFetch: () => void, loading: boolean, isCompleted: boolean, emailData?: any }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-10 w-full">
      <h3 className="text-2xl font-semibold mb-2">Fetch Email</h3>
      <p className="text-gray-600 mb-6">
        Auth received! Use the code snippet below to fetch emails
      </p>
      
      <div className="bg-green-50 border-2 border-green-200 py-3 px-4 rounded-lg mb-6">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-2">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-green-700 font-medium">Auth Received</span>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-xs font-mono">python</span>
        </div>
        <div className="p-4">
          <pre className="text-sm font-mono whitespace-pre">
{`response = scalekit.connect.execute_tool(
    tool_name="GMAIL.FETCH_EMAILS",
    identifier="{identifier}",
    tool_input={
        "max_results" : 1
    },
)`}
          </pre>
        </div>
      </div>
      
      {!isCompleted ? (
        <button
          onClick={onFetch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-6"
        >
          {loading ? 'Running...' : 'Run'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full bg-green-50 border-2 border-green-200 py-4 px-6 rounded-lg mb-4">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-700 font-medium">Email Fetched Successfully</span>
          </div>
          
          {emailData && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Email Preview:</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-600">From:</span>
                  <p className="text-sm text-gray-900">{emailData.from}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-600">Subject:</span>
                  <p className="text-sm text-gray-900">{emailData.subject}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-600">Body:</span>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{emailData.body}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const Step3 = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-10 w-full">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          Congratulations! You've successfully integrated with Scalekit's platform. 
          You now have the power to connect to Gmail and fetch emails seamlessly.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">What's Next?</h4>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Explore more connectors and integrations
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Build powerful workflows with our APIs
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Scale your integrations across multiple platforms
          </li>
        </ul>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://scalekit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-800 font-medium transition-all duration-200 transform hover:scale-105"
          >
            explore scalekit.com
          </a>
          <a
            href="https://docs.scalekit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:border-gray-400 hover:bg-gray-50 font-medium transition-all duration-200"
          >
            View Documentation
          </a>
        </div>
        
        <div className="text-center pt-4">
          <div className="flex items-center justify-center mb-2">
            <img src="/scalkit.svg" alt="Scalekit" className="h-4 opacity-60" />
          </div>
          <p className="text-sm text-gray-500">
            Need help? Check out our{" "}
            <a 
              href="https://docs.scalekit.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              comprehensive documentation
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

// Cookie utility functions
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const setCookie = (name: string, value: string, hours: number) => {
  const maxAge = hours * 60 * 60; // Convert hours to seconds
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [emailData, setEmailData] = useState(null)
  const [completedSteps, setCompletedSteps] = useState<{[key: number]: any}>({})
  const [stepResults, setStepResults] = useState<{[key: number]: any}>({})
  const [authLink, setAuthLink] = useState<string | null>(null)
  const [authLinkLoading, setAuthLinkLoading] = useState(true)
  const [identifier, setIdentifier] = useState<string | null>(null)
  const [identifierLoading, setIdentifierLoading] = useState(true)

  // Get or generate identifier and auth link on component mount
  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for existing identifier in cookie
        let currentIdentifier = getCookie('scalekit_identifier')
        
        if (currentIdentifier) {
          console.log('Using existing identifier from cookie:', currentIdentifier)
          setIdentifier(currentIdentifier)
        } else {
          console.log('No identifier found, generating new one...')
          const identifierResponse = await fetch('/api/get-identifier', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          
          if (identifierResponse.ok) {
            const identifierResult = await identifierResponse.json()
            currentIdentifier = identifierResult.identifier
            console.log('New identifier generated:', currentIdentifier)
            
            // Store in cookie for 12 hours
            setCookie('scalekit_identifier', currentIdentifier, 12)
            setIdentifier(currentIdentifier)
          } else {
            console.error('Failed to generate identifier:', identifierResponse.status)
            setIdentifierLoading(false)
            return
          }
        }
        
        setIdentifierLoading(false)
        
        // Now generate auth link with the identifier
        console.log('Generating auth link with identifier:', currentIdentifier)
        const authResponse = await fetch('/api/get-auth-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: currentIdentifier })
        })
        
        if (authResponse.ok) {
          const authResult = await authResponse.json()
          console.log('Auth link generated:', authResult.auth_link)
          setAuthLink(authResult.auth_link)
        } else {
          console.error('Failed to generate auth link:', authResponse.status)
        }
      } catch (error) {
        console.error('Error initializing app:', error)
        setIdentifierLoading(false)
      } finally {
        setAuthLinkLoading(false)
      }
    }
    
    initializeApp()
  }, [])

  const handleStep1Next = async (data: any) => {
    if (!authLink) {
      console.error('No auth link available')
      return
    }
    
    setLoading(true)
    console.log('Opening auth link in new tab:', authLink)
    
    // Open the pre-generated auth link in new tab
    const newTab = window.open(authLink, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes')
    
    if (!newTab || newTab.closed) {
      console.log('Popup blocked, trying alternative method...')
      // Fallback: create and click a link
      const link = document.createElement('a')
      link.href = authLink
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    // Start polling for connection status immediately
    console.log('Starting polling for connection status...')
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch('/api/check-connection-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: identifier })
        })
        
        if (statusResponse.ok) {
          const statusResult = await statusResponse.json()
          console.log('Poll result:', statusResult)
          
          if (statusResult.connected && statusResult.status === 'active') {
            console.log('Connection successful!')
            clearInterval(pollInterval)
            setCompletedSteps(prev => ({ ...prev, 1: true }))
            setStepResults(prev => ({ ...prev, 1: { provider: 'gmail', account: statusResult.account } }))
            setCurrentStep(2)
            setLoading(false)
            
            // Close the authorization tab if still open
            if (newTab && !newTab.closed) {
              newTab.close()
            }
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000)
    
    // Stop polling after 5 minutes
    setTimeout(() => {
      console.log('Polling timeout reached')
      clearInterval(pollInterval)
      setLoading(false)
      if (newTab && !newTab.closed) {
        newTab.close()
      }
    }, 300000)
  }

  const handleFetchEmail = async () => {
    console.log("=== FRONTEND: Starting email fetch ===")
    setLoading(true)
    try {
      console.log("Making request to /api/fetch-email...")
      const response = await fetch('/api/fetch-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier })
      })
      
      console.log("Response status:", response.status)
      console.log("Response headers:", [...response.headers.entries()])
      
      if (response.ok) {
        const result = await response.json()
        console.log("Success response:", result)
        setEmailData(result.email)
        setCompletedSteps(prev => ({ ...prev, 2: true }))
        setStepResults(prev => ({ ...prev, 2: { email: result.email } }))
        setCurrentStep(3)
      } else {
        console.error("Error response status:", response.status)
        const errorText = await response.text()
        console.error("Error response body:", errorText)
        try {
          const errorJson = JSON.parse(errorText)
          console.error("Parsed error JSON:", errorJson)
        } catch (parseError) {
          console.error("Could not parse error response as JSON")
        }
      }
    } catch (error) {
      console.error('Network or other error:', error)
      console.error('Error type:', typeof error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    setLoading(false)
  }

  const handleStep2Next = () => {
    setCurrentStep(3)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Try Scalekit Tools in Seconds
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get started with our powerful integration platform in just a few simple steps
          </p>
        </div>
        
        <div className="flex min-h-screen">
          {/* Left side - Stepper with content boxes directly below each step */}
          <div className="w-2/3 pr-8 space-y-8">
            {/* Step 1 Section */}
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-semibold border-2 ${
                    1 <= currentStep 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 1 === currentStep + 1
                      ? 'bg-white text-blue-600 border-blue-600'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {1 < currentStep ? '✓' : 1}
                  </div>
                  <div className={`w-0.5 h-full mt-2 ${
                    1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} style={{ minHeight: '200px' }} />
                </div>
                <div className="flex-1 pt-2 space-y-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      1 <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      Connect Account
                    </h3>
                    <p className={`text-sm mt-1 ${
                      1 <= currentStep ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Link your Gmail account
                    </p>
                  </div>
                  
                  
                  {/* Step 1 content box */}
                  {(currentStep === 1 || completedSteps[1]) && (
                    <div className="mt-4">
                      <Step1 onNext={handleStep1Next} loading={loading} isCompleted={completedSteps[1]} authLinkLoading={authLinkLoading} identifierLoading={identifierLoading} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 Section */}
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-semibold border-2 ${
                    2 <= currentStep 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 2 === currentStep + 1
                      ? 'bg-white text-blue-600 border-blue-600'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {2 < currentStep ? '✓' : 2}
                  </div>
                  <div className={`w-0.5 h-full mt-2 ${
                    2 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} style={{ minHeight: '200px' }} />
                </div>
                <div className="flex-1 pt-2 space-y-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      2 <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      Fetch Email
                    </h3>
                    <p className={`text-sm mt-1 ${
                      2 <= currentStep ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Fetch email content
                    </p>
                  </div>
                  
                  
                  {/* Step 2 content box */}
                  {(currentStep === 2 || completedSteps[2]) && (
                    <div className="mt-4">
                      <Step2 onFetch={handleFetchEmail} loading={loading} isCompleted={completedSteps[2]} emailData={stepResults[2]?.email} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 Section */}
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex flex-col items-center mr-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-semibold border-2 ${
                    3 <= currentStep 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 3 === currentStep + 1
                      ? 'bg-white text-blue-600 border-blue-600'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                    {3 < currentStep ? '✓' : 3}
                  </div>
                </div>
                <div className="flex-1 pt-2 space-y-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      3 <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      Get Started
                    </h3>
                    <p className={`text-sm mt-1 ${
                      3 <= currentStep ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Complete setup
                    </p>
                  </div>
                  
                  
                  {/* Step 3 content box */}
                  {currentStep === 3 && (
                    <div className="mt-4">
                      <Step3 />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Empty for now */}
          <div className="w-1/3">
            {/* This space can be used for additional content if needed */}
          </div>
        </div>
      </div>
    </main>
  )
}
