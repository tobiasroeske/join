function generateNewContactEditorHTML() {
    return /*html*/`
        <div class="new-contact-container" id="newContact">
            <div class="add-contact-left">
                <div class="contact-join-logo"> <img src="assets/img/contact_logo.svg" alt="join logo"></div>
                <h1 class="page-heading">Add contact</h1>
                <span class="special-subheading">Tasks are better with a team!</span>
            </div>
            <div class="add-contact-right">
                <img src="assets/img/contacts_close.svg" alt="close icon" class="icon close-icon"
                    onclick="closePopupAndStartAnimation('newContact', 'popup')">
                <img src="assets/img/contact_contact_img.svg" alt="" class="contact-img">
                <form onsubmit="addNewContact(event); return false;" class="contact-form">
                    <div class="input-container">
                        <div class="input-field">
                            <input required type="text" name="" id="nameInput" placeholder="Name" class="special-input">
                            <img src="assets/img/contacts_person.svg" alt="">
                        </div>
                    </div>

                    <div class="input-field">
                        <input required type="email" name="" id="emailInput" placeholder="Email" class="special-input">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="input-field">
                        <input required type="text" maxlength="15" oninput="this.value = this.value.replace(/[^0-9]/g, '')" name="phoneInput" id="phoneInput" placeholder="Phone" class="special-input">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="contact-submit-field">
                        <div class="submit-btn clear-btn" onclick="togglePopup()">Cancel<img
                                src="assets/img/contacts_close.svg" alt=""></div>
                        <button class="submit-btn add-btn" >Create contact <img src="assets/img/check_icon.svg"
                                alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function generateContactEditorHTML(contact, index) {
    return /*html*/`
        <div class="new-contact-container" id="editContact">
            <div class="add-contact-left">
                <div class="contact-join-logo"> <img src="assets/img/contact_logo.svg" alt="join logo"></div>
                <h1 class="page-heading">Edit Contact</h1>
            </div>
            <div class="add-contact-right">
                <img src="assets/img/contacts_close.svg" alt="close icon" class="icon close-icon"
                    onclick="closePopupAndStartAnimation('editContact', 'popup')">
                <div class="name-initials ${contact['color']}">${getInitials(contact['name'])}</div>
                <form onsubmit="editContact(${index}, event); return false;" class="contact-form">
                    <div class="input-container">
                        <div class="input-field">
                            <input required type="text" name="" id="nameInput" placeholder="Name" class="special-input" value="${contact['name']}">
                            <img src="assets/img/contacts_person.svg" alt="">
                        </div>
                    </div>

                    <div class="input-field">
                        <input required type="email" name="" id="emailInput" placeholder="Email" class="special-input" value="${contact['email']}">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="input-field">
                        <input required type="text" maxlength="15" oninput="this.value = this.value.replace(/[^0-9]/g, '')" name="" id="phoneInput" placeholder="Phone" class="special-input" value="${contact['phone']}">
                        <img src="assets/img/contacts_call.svg" alt="">
                    </div>
                    <div class="contact-submit-field">
                        <div class="submit-btn clear-btn" onclick="deleteContact(${index});togglePopup('popup')">Delete<img
                                src="assets/img/contacts_close.svg" alt=""></div>
                        <button class="submit-btn add-btn">Save <img src="assets/img/check_icon.svg"
                                alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function generateContactCardHTML(contact, index) {
    return /*html*/`
        <div class="contact-heading">
            <div class="name-initials ${contact['color']}" id="nameInitials">${getInitials(contact['name'])}</div>
            <div class="contact-heading-content">
                <span class="contact-name" id="contactName">${capitalizeFirstLetter(contact['name'])}</span>
                    <div class="edit-contact">
                        <div id="editContact" onclick="renderContactEditor(${index})"><img src="assets/img/contacts_edit.svg" alt="edit icon"> Edit</div>
                        <div id="deleteContact" onclick="deleteContact(${index})"><img src="assets/img/contacts_delete.svg" alt="delete icon"> Delete</div>
                    </div>
            </div>
        </div>

        <span class="contact-information">Contact Information</span>

        <div class="contact-info-box">
            <div class="info-box">
                <span class="bold">Email</span>
                <span class="contact-email" id="contactEmail">${contact['email']}</span>
            </div>

            <div class="info-box">
                <span class="bold">Phone</span>
                <span>${contact['phone'] == undefined ? 'not specified' : contact['phone']}</span>
            </div>
        </div>
        <div class="menu-contact-options">
            <div class="mobile-icon" onclick="openContactOptionPopup(); stopOtherActions(event)">
                <img src="assets/img/contact_more_icon.svg" alt="" >
            </div>
            <div class="contact-options-popup" id="contactOptionsPopup">
                <div id="editContact" onclick="renderContactEditor(${index})" class="contact-options"><img src="assets/img/contacts_edit.svg" alt="edit icon"> Edit</div>
                <div id="deleteContact" onclick="deleteContact(${index})" class="contact-options"><img src="assets/img/contacts_delete.svg" alt="delete icon"> Delete</div>
            </div>
        </div>
        
    `
}

function generateContactBoxHTML(contact, index) {
    return /*html*/`
        <div class=contact-box id="contactBox${index}" onclick="renderContact(${index}); changeContactToActive('contactBox${index}')">
                <div class="initials ${contact['color']}">
                    <span>${getInitials(contact['name'])}</span>
                </div>
                <div class="contact-info-in-list">
                    <span class="contact-info-name">${capitalizeFirstLetter(contact['name'])}</span>
                    <span class="contact-email">${contact['email']}</span>
                </div>
            </div>
    `;
}