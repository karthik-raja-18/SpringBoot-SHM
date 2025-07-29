import React from 'react';
import '../styles/ContactModal.css';

const ContactModal = ({ isOpen, onClose, contactInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Contact Information</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="contact-info">
            <div className="contact-item">
              <span className="label">Name:</span>
              <span className="value">{contactInfo.name || 'N/A'}</span>
            </div>
            <div className="contact-item">
              <span className="label">Email:</span>
              <a 
                href={`mailto:${contactInfo.email}`} 
                className="value email"
                onClick={e => e.stopPropagation()}
              >
                {contactInfo.email || 'N/A'}
              </a>
            </div>
            {contactInfo.phone && (
              <div className="contact-item">
                <span className="label">Phone:</span>
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="value phone"
                  onClick={e => e.stopPropagation()}
                >
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {contactInfo.address && (
              <div className="contact-item">
                <span className="label">Address:</span>
                <span className="value">{contactInfo.address}</span>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
