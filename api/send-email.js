// Vercel Serverless Function for sending FounderFit results via email
// Uses Resend API for email delivery

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, overallScore, dimensionScores } = req.body;

        // Validate required fields
        if (!name || !email || overallScore === undefined || !dimensionScores) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Get Resend API key from environment variable
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not configured');
            return res.status(500).json({ error: 'Email service not configured' });
        }

        // Generate email HTML content
        const emailHTML = generateEmailHTML(name, overallScore, dimensionScores);

        // Send email via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'FounderFit <results@founderfit.execom.ca>',
                to: [email],
                subject: `Your FounderFit Score™: ${overallScore}/100`,
                html: emailHTML
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API error:', data);
            return res.status(500).json({ error: 'Failed to send email', details: data });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully',
            emailId: data.id 
        });

    } catch (error) {
        console.error('Error in send-email function:', error);
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}

function generateEmailHTML(name, overallScore, dimensionScores) {
    // Generate interpretation
    let interpretation = '';
    if (overallScore >= 80) {
        interpretation = 'Founder personality strongly aligned with success indicators. Your profile suggests high potential for building and scaling ventures.';
    } else if (overallScore >= 65) {
        interpretation = 'Above-average alignment with founder success profile. You demonstrate strong entrepreneurial characteristics with room for development.';
    } else if (overallScore >= 50) {
        interpretation = 'Average alignment with founder success profile. You have solid foundational traits with opportunities to strengthen key areas.';
    } else {
        interpretation = 'Below-average alignment with founder success profile. Consider how you might develop key entrepreneurial characteristics.';
    }

    // Generate dimension interpretations
    const dimensionInterpretations = {
        'Openness': (score) => score >= 70 ? 'High openness indicates strong exploratory thinking and willingness to challenge conventions.' :
                                score >= 40 ? 'Balanced openness - you integrate new ideas while maintaining strategic focus.' :
                                'Lower openness suggests preference for proven approaches and execution focus.',
        'Conscientiousness': (score) => score >= 70 ? 'High conscientiousness indicates strong attention to detail and operational rigor.' :
                                         score >= 40 ? 'Balanced conscientiousness - you maintain quality while staying agile.' :
                                         'Lower conscientiousness suggests visionary focus - consider operational support.',
        'Energy & Drive': (score) => score >= 70 ? 'High energy and drive - you demonstrate exceptional resilience and ambition.' :
                                      score >= 40 ? 'Balanced energy - sustainable approach to building ventures.' :
                                      'Measured energy - focus on leverage and team empowerment.',
        'Conviction': (score) => score >= 70 ? 'Strong conviction in your strategic direction and thesis.' :
                                  score >= 40 ? 'Balanced conviction - open to feedback while maintaining clarity.' :
                                  'Adaptable conviction - ensure strategic direction clarity.',
        'Emotional Stability': (score) => score >= 70 ? 'High emotional stability - you remain composed under pressure.' :
                                           score >= 40 ? 'Balanced emotional regulation - effective stress management.' :
                                           'Sensitive to pressure - consider stress management strategies.',
        'Skepticism & Adaptability': (score) => score >= 70 ? 'Independent thinker - you question assumptions and test ideas.' :
                                                 score >= 40 ? 'Balanced skepticism - integrate diverse perspectives.' :
                                                 'Trust in proven approaches - leverage expert guidance.'
    };

    // Build dimensions HTML
    let dimensionsHTML = '';
    Object.entries(dimensionScores).forEach(([dim, score]) => {
        const interpFunc = dimensionInterpretations[dim];
        const interp = interpFunc ? interpFunc(score) : 'Dimension assessment complete.';
        dimensionsHTML += `
            <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #1f8a70;">
                <h3 style="margin: 0 0 10px 0; color: #1f8a70;">${dim}: ${score}/100</h3>
                <p style="margin: 0; color: #555; line-height: 1.6;">${interp}</p>
            </div>
        `;
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white;">
                <div style="background: linear-gradient(135deg, #1f8a70 0%, #166b54 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 32px;">FounderFit Score™</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Founder Personality Assessment</p>
                </div>
                
                <div style="padding: 40px 30px;">
                    <p style="font-size: 16px; margin-bottom: 10px;">Hi ${name},</p>
                    
                    <p style="margin-bottom: 30px;">Thank you for completing the FounderFit Score™ assessment. Here are your detailed results:</p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="display: inline-block; background: #f8f9fa; padding: 30px 50px; border-radius: 12px; border: 2px solid #1f8a70;">
                            <div style="font-size: 16px; color: #666; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Your Overall Score</div>
                            <div style="font-size: 72px; font-weight: bold; color: #1f8a70; line-height: 1;">${overallScore}</div>
                            <div style="font-size: 16px; color: #666; margin-top: 10px;">out of 100</div>
                        </div>
                    </div>
                    
                    <div style="background: #f0f7f5; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #1f8a70;">
                        <p style="margin: 0; font-size: 15px; color: #2c3e50; line-height: 1.6;"><strong>Interpretation:</strong> ${interpretation}</p>
                    </div>
                    
                    <h2 style="color: #1f8a70; margin-top: 50px; margin-bottom: 20px; font-size: 24px;">Your Dimension Breakdown</h2>
                    <p style="color: #666; margin-bottom: 30px;">Each dimension represents a key aspect of founder personality that correlates with entrepreneurial success:</p>
                    
                    ${dimensionsHTML}
                    
                    <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e0e0e0;">
                        <h3 style="color: #1f8a70; margin-bottom: 15px;">What's Next?</h3>
                        <p style="color: #666; line-height: 1.8; margin: 0;">Use these insights to identify your natural strengths and development opportunities. Consider sharing your results with mentors, co-founders, or advisors to inform team composition and personal development strategies.</p>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;">© 2026 FounderFit Score™ | ExeCom</p>
                    <p style="margin: 0; color: #999; font-size: 12px;">This assessment is designed to provide insights into founder personality traits. Results should be used as one input among many in personal and professional development.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
