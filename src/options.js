// Saves options to chrome.storage
function save_options() {
    var timeChange = document.getElementById('time_change').checked;

    chrome.storage.sync.set({
        timeChange: timeChange
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        timeChange: true
    }, function (items) {
        console.log(`time change: ${items.timeChange}`)
        document.getElementById('time_change').checked = items.timeChange;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('time_change').addEventListener("change", save_options)
