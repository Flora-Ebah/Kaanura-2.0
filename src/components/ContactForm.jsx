import React from 'react';

const ContactForm = () => {
    return (
        <form>
            <label>
                Nom:
                <input type="text" name="name" />
            </label>
            <label>
                Email:
                <input type="email" name="email" />
            </label>
            <button type="submit">Envoyer</button>
        </form>
    );
};

export default ContactForm; 