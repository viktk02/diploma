'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const roleSelect = document.querySelector('#id_role');
    if (!roleSelect) return;

    function toggleFlags(role) {
        const isStaff = document.querySelector('#id_is_staff');
        const isSuperuser = document.querySelector('#id_is_superuser');
        
        if (!isStaff || !isSuperuser) return;

        if (role === 'root') {
            isStaff.checked = true;
            isSuperuser.checked = true;
        } else if (role === 'editor') {
            isStaff.checked = true;
            isSuperuser.checked = false;
            
        }

        isStaff.disabled = true;
        isSuperuser.disabled = true;
    }

    toggleFlags(roleSelect.value);
    roleSelect.addEventListener('change', function() {
        toggleFlags(this.value);
    });
});