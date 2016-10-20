class NoteOverlayController {
    constructor() {}
}

const NoteOverlayComponent = {
    bindings: {
        note: '<',
        closeNote: '&'
    },
    controller: NoteOverlayController,
    template: `
       <div id="note-overlay">
         <div class="note">
            test
         </div>
       </div>
    `
};

const noteOverlay = angular
    .module('noteOverlay', ['ngSanitize'])
    .component('noteOverlay', NoteOverlayComponent)
    .name;

export default noteOverlay;