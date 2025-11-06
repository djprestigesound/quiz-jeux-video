const QRCode = require('qrcode');
const config = require('../config/config');

exports.showQRCode = async (req, res) => {
  try {
    // Détecter l'URL : production ou local
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${config.port}`;

    // Générer plusieurs formats de QR codes
    const qrCodeDataURL = await QRCode.toDataURL(baseUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#00F0FF',  // Couleur néon cyan
        light: '#050810'  // Fond sombre
      }
    });

    // QR code en grand format pour impression
    const qrCodePrintURL = await QRCode.toDataURL(baseUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 800
    });

    res.render('qrcode-public', {
      baseUrl,
      qrCodeDataURL,
      qrCodePrintURL
    });
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    res.status(500).send('Erreur lors de la génération du QR code');
  }
};
