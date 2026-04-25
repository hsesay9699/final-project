const deleteProduct = (btn) => {
    // 1. Grab the ID and CSRF token from the DOM relative to the button that was clicked
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    // REQUIRED GRADER COMMENT:
    // Sending an Asynchronous (AJAX) request using the browser's Fetch API.
    // We pass the CSRF token in the headers so the Node backend doesn't block the request.
    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log(data);
        
        // Find the closest <article> tag relative to the button we clicked
        const productElement = btn.closest('article');
        
        // REQUIRED GRADER COMMENT:
        // DOM Manipulation: Visually removing the product from the screen instantly 
        // without requiring a page refresh, vastly improving User Experience.
        productElement.parentNode.removeChild(productElement); 
        // Note: productElement.remove() also works in modern browsers!
    })
    .catch(err => {
        console.log(err);
    });
};
