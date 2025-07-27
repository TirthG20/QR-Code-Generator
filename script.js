const form = document.getElementById('qrForm');
const qrContainer = document.getElementById('qrContainer');

function downloadQrCode(qrCanvas, format, fileName) {
  fileName = fileName || 'qrcode';
  try {
    if (format === 'png') {
      const link = document.createElement('a');
      link.href = qrCanvas.toDataURL('image/png');
      link.download = `${fileName}.png`;
      link.click();
    } else if (format === 'jpg') {
      const link = document.createElement('a');
      link.href = qrCanvas.toDataURL('image/jpeg', 0.9);
      link.download = `${fileName}.jpg`;
      link.click();
    } else if (format === 'svg') {
      const svg = qrContainer.querySelector('svg');
      if (svg) {
        const svgData = svg.outerHTML;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.svg`;
        link.click();
      } else {
        throw new Error('SVG QR code not found');
      }
    } else if (format === 'pdf') {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.addImage(qrCanvas.toDataURL('image/png'), 'PNG', 10, 10, 50, 50);
      doc.save(`${fileName}.pdf`);
    }
  } catch (error) {
    console.error('Error downloading QR code:', error);
    alert('Failed to download QR code. Please try again.');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = document.getElementById('url').value;
  const color = document.getElementById('color').value;
  const logo = document.getElementById('logo').files[0];
  const size = parseInt(document.getElementById('size').value);
  const format = document.getElementById('format').value;

  qrContainer.innerHTML = '';

  try {
    const qrCode = new QRCode(qrContainer, {
      text: url,
      width: size,
      height: size,
      colorDark: color,
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });

    if (logo) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = qrContainer.querySelector('canvas');
          if (!canvas) {
            console.error('Canvas not found for QR code');
            alert('Failed to generate QR code with logo. Please try again.');
            return;
          }
          const ctx = canvas.getContext('2d');
          const logoSize = size / 4;
          const x = (size - logoSize) / 2;
          const y = (size - logoSize) / 2;
          ctx.drawImage(img, x, y, logoSize, logoSize);
          downloadQrCode(canvas, format, 'qrcode');
        };
        img.onerror = () => {
          console.error('Error loading logo image');
          alert('Failed to load logo. Please ensure it’s a valid PNG or JPG file.');
        };
      };
      reader.onerror = () => {
        console.error('Error reading logo file');
        alert('Failed to read logo file. Please try again.');
      };
      reader.readAsDataURL(logo);
    } else {
      const canvas = qrContainer.querySelector('canvas');
      if (!canvas) {
        console.error('Canvas not found for QR code');
        alert('Failed to generate QR code. Please try again.');
        return;
      }
      downloadQrCode(canvas, format, 'qrcode');
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
});

// Initialize particles.js
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 200, color: '#ffffff', opacity: 0.9, width: 1 },
    move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
    modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
  },
  retina_detect: true
});