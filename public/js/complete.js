window.addEventListener('load', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            console.log(e.target.checked, e.target.id);
            const id = e.target.id.split("-")[1];

            const url = `/tasks/${id}/complete`;

            fetch(url, {
                method: 'POST'
            })
        })
    })
})