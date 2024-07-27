async function searchInvoice() {
    const releaseNumber = document.getElementById('releaseNumber').value;
    if (!releaseNumber) {
        alert('Please enter a release number');
        return;
    }

    try {
        const response = await fetch(`https://crown-crating-1.onrender.com/invoices/${releaseNumber}`);
        if (!response.ok) {
            if (response.status === 404) {
                alert('Invoice not found');
            } else {
                alert('Error fetching invoice: ' + response.statusText);
            }
            return;
        }
        const invoice = await response.json();
        displayInvoice(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        alert('Error fetching invoice: ' + error.message);
    }
}

function displayInvoice(invoice) {
    const invoiceDetails = document.getElementById('invoiceDetails');
    const validCharges = invoice.chargeAmount.filter(item => item.amount !== undefined && item.amount !== null);
    const totalAmount = validCharges.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2);

    // Parse weight and cube to ensure they are displayed correctly
    const weight = invoice.weight !== undefined ? parseFloat(invoice.weight) : '';
    const cube = invoice.cube !== undefined ? parseFloat(invoice.cube) : '';

    invoiceDetails.innerHTML = `
        <div class="invoice">
            <div class="header-invoice" style="background-image: url('image/header.png');">
                <div class="logo-container">
                    <img src="image/logo-removebg.png" alt="Logo" class="logo">
                </div>
                <h2 class="arrival-notice">ARRIVAL NOTICE</h2>
                <div class="address">
                    <p>T: (888) 880-0852</p>
                    <p>4111 Ellison St NE,</p>
                    <p>Albuquerque, NM 87109</p> 
                </div>
            </div>
            <div class="pickup-date-container">
                <p><strong>Pick Up Date:</strong> <span id="pickup-date">${new Date().toLocaleDateString()}</span></p>
                <button class="recalculate-btn" onclick="resetDate()">Recalculate</button>
            </div>
            <div class="invoice-details-container">
                <p><strong>Release Number:</strong> <span>${invoice.releaseNumber}</span></p>
                <p><strong>Master B/L:</strong> <span>${invoice.masterBL}</span></p>
                <p><strong>Container:</strong> <span>${invoice.container}</span></p>
                <p><strong>House B/L Number:</strong> <span>${invoice.houseBL || ''}</span></p>
                <p><strong>Pieces:</strong> <span>${invoice.pieces}</span></p>
                <p><strong>Weight:</strong> <span>${weight !== '' ? weight : ''}</span></p>
                <p><strong>Cube:</strong> <span>${cube !== '' ? cube : ''}</span></p>
            </div>
            <div class="payment-status-container">
                <p><strong>Payment Status:</strong></p>
                <span id="payment-status">${invoice.status}</span>
            </div>
            <br>
            <div class="charge-amount">
                <p><strong>Charged Amount:</strong></p>
                <table>
                    <tr>
                        <th>Reason</th>
                        <th>Amount</th>
                    </tr>
                    ${validCharges.map(item => `<tr><td>${item.reason}</td><td>$${parseFloat(item.amount).toFixed(2)}</td></tr>`).join('')}
                    <tr>
                        <th>Total</th>
                        <td><strong>$${totalAmount}</strong></td>
                    </tr>
                </table>
                <button class="button" onclick="openPopupForm()">
                   <span class="button_lg">
                     <span class="button_sl"></span>
                     <span class="button_text">Click Here to Proceed</span>
                   </span>
                </button>
            </div>
        </div>
    `;
}

function resetDate() {
    document.getElementById('pickup-date').textContent = new Date().toLocaleDateString();
}

function openPopupForm() {
    document.getElementById('popupForm').style.display = 'block';
    document.body.classList.add('popup-active');
}

function closePopupForm() {
    document.getElementById('popupForm').style.display = 'none';
    document.body.classList.remove('popup-active');
}

// Event listener to close the popup when clicking outside of it
window.addEventListener('click', function(event) {
    const popupForm = document.getElementById('popupForm');
    if (event.target == popupForm) {
        closePopupForm();
    }
});
