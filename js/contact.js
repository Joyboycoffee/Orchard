/* 
  ================================================================
  ORCHARD E-COMMERCE PLATFORM - CONTACT FORM LOGIC
  Handles: Contact Form Submission & LocalStorage Message Saving
  ================================================================
*/

function handleContactSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  if (!nameInput || !emailInput || !messageInput) return;

  const newMessage = {
    id: 'msg-' + Date.now(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput ? phoneInput.value.trim() : '',
    subject: subjectInput ? subjectInput.value.trim() : 'Inquiry',
    message: messageInput.value.trim(),
    date: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  // Retrieve existing messages from LocalStorage
  let messages = JSON.parse(localStorage.getItem('orchard_messages')) || [];
  messages.unshift(newMessage);
  localStorage.setItem('orchard_messages', JSON.stringify(messages));

  // Reset form
  e.target.reset();

  showToast('Message submitted successfully! Admin will review it in the Admin Panel.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
});
