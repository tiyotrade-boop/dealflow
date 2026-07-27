export function welcomeEmail(name: string) {
  return {
    subject: 'Welcome to DealAnalytic! 🏠',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #2563EB; color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 12px;">
            DA
          </div>
          <h1 style="color: #1a202c; font-size: 28px; margin-top: 20px;">Welcome to DealAnalytic!</h1>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Hi ${name || 'there'},
        </p>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Thanks for subscribing to <strong>DealAnalytic</strong>! You now have full access to all features.
        </p>

        <div style="background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #2d3748; font-size: 18px; margin-top: 0;">What you can do now:</h2>
          <ul style="color: #4a5568; font-size: 16px; line-height: 2;">
            <li>📊 Calculate flip profits in 5 seconds</li>
            <li>💾 Save and track all your deals</li>
            <li>📈 See ROI instantly</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://dealanalytic.com/dashboard" style="background: #2563EB; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Go to Dashboard →
          </a>
        </div>

        <p style="color: #718096; font-size: 14px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          Need help? Reply to this email or contact <a href="mailto:support@dealanalytic.com" style="color: #2563EB;">support@dealanalytic.com</a>
        </p>
      </div>
    `
  };
}

export function trialEndingEmail(name: string, daysLeft: number) {
  return {
    subject: `Your DealAnalytic trial ends in ${daysLeft} days ⏳`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a202c; font-size: 28px;">⏳ Trial Ending Soon</h1>
        </div>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Hi ${name || 'there'},
        </p>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Your 7-day free trial of <strong>DealAnalytic</strong> ends in <strong>${daysLeft} days</strong>.
        </p>

        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          After your trial ends, you'll be charged <strong>$49/month</strong> to keep using the service.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://dealanalytic.com/dashboard" style="background: #2563EB; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Manage Subscription
          </a>
        </div>

        <p style="color: #718096; font-size: 14px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          Need help? Contact <a href="mailto:support@dealanalytic.com" style="color: #2563EB;">support@dealanalytic.com</a>
        </p>
      </div>
    `
  };
}