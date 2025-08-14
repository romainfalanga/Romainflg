import { corsHeaders } from '../_shared/cors.ts';

interface ApplicationData {
  project_name: string;
  name: string;
  email: string;
  position: string;
  telegram: string;
  tiktok?: string;
  motivation: string;
  creativity?: string;
  universe_model?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const applicationData: ApplicationData = await req.json();

    // Store the application in the database first
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
      },
      body: JSON.stringify({
        project_name: applicationData.project_name,
        name: applicationData.name,
        email: applicationData.email,
        position: applicationData.position,
        telegram: applicationData.telegram,
        tiktok: applicationData.tiktok,
        motivation: applicationData.motivation,
        creativity: applicationData.creativity,
        universe_model: applicationData.universe_model,
      }),
    });

    if (!dbResponse.ok) {
      throw new Error(`Failed to store application: ${dbResponse.statusText}`);
    }

    // Create email content
    const emailSubject = `Nouvelle candidature ${applicationData.position} - ${applicationData.project_name}`;
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #667eea; background: #f8f9fa; }
        .section h3 { margin-top: 0; color: #667eea; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .info-item { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; }
        .info-label { font-weight: bold; color: #495057; margin-bottom: 5px; }
        .position-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
        .coo { background: #d4edda; color: #155724; }
        .cm { background: #f8d7da; color: #721c24; }
        .actions { background: #e7f3ff; padding: 20px; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Nouvelle Candidature Reçue !</h1>
        <p>Une nouvelle personne souhaite rejoindre votre équipe</p>
    </div>
    
    <div class="content">
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">👤 Candidat</div>
                <div>${applicationData.name}</div>
            </div>
            <div class="info-item">
                <div class="info-label">📧 Email</div>
                <div><a href="mailto:${applicationData.email}">${applicationData.email}</a></div>
            </div>
            <div class="info-item">
                <div class="info-label">🚀 Projet</div>
                <div>${applicationData.project_name}</div>
            </div>
            <div class="info-item">
                <div class="info-label">💼 Poste</div>
                <div><span class="position-badge ${applicationData.position.toLowerCase()}">${applicationData.position}</span></div>
            </div>
            <div class="info-item">
                <div class="info-label">💬 Telegram</div>
                <div>${applicationData.telegram}</div>
            </div>
            <div class="info-item">
                <div class="info-label">🎵 TikTok</div>
                <div>${applicationData.tiktok || 'Non renseigné'}</div>
            </div>
        </div>

        <div class="section">
            <h3>💭 Motivation</h3>
            <p style="white-space: pre-wrap;">${applicationData.motivation}</p>
        </div>

        ${applicationData.creativity ? `
        <div class="section">
            <h3>🎨 Définition de la créativité</h3>
            <p style="white-space: pre-wrap;">${applicationData.creativity}</p>
        </div>
        ` : ''}

        ${applicationData.universe_model ? `
        <div class="section">
            <h3>🌌 Modèle d'univers imaginé</h3>
            <p style="white-space: pre-wrap;">${applicationData.universe_model}</p>
        </div>
        ` : ''}

        <div class="actions">
            <h3>🎯 Actions recommandées</h3>
            <ul>
                <li>✅ Vérifier le profil Telegram: <strong>${applicationData.telegram}</strong></li>
                ${applicationData.tiktok ? `<li>🎵 Consulter le TikTok: <strong>${applicationData.tiktok}</strong></li>` : '<li>❌ Pas de TikTok fourni</li>'}
                <li>📧 Répondre au candidat: <a href="mailto:${applicationData.email}?subject=Re: Candidature ${applicationData.position} - ${applicationData.project_name}">${applicationData.email}</a></li>
                <li>📊 Voir toutes les candidatures sur votre dashboard admin</li>
            </ul>
        </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
        Candidature reçue le ${new Date().toLocaleString('fr-FR')}
    </div>
</body>
</html>
    `.trim();

    // Send email using a simple SMTP service or webhook
    // For now, we'll use a webhook service like Zapier or Make.com
    // You can also integrate with services like Resend, SendGrid, etc.
    
    // Simple email sending using a webhook (you'll need to configure this)
    const emailData = {
      to: 'romainfalanga83@gmail.com',
      subject: emailSubject,
      html: emailBody,
      from: 'noreply@romainflg.com' // You'll need to configure this domain
    };

    // For demonstration, we'll log the email that would be sent
    console.log('📧 Email would be sent:');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('HTML content prepared');

    // TODO: Integrate with actual email service
    // Example with Resend (you'd need to add RESEND_API_KEY to your Supabase environment):
    /*
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'candidatures@romainflg.com',
        to: ['romainfalanga83@gmail.com'],
        subject: emailSubject,
        html: emailBody,
      }),
    });
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application submitted and stored successfully',
        debug: {
          stored_in_database: true,
          email_prepared: true,
          note: 'Email service needs to be configured with Resend or similar'
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('❌ Error processing application:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});