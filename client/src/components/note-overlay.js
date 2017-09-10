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
       <div class="note-background" ng-click="$ctrl.closeNote()" ng-if="$ctrl.note">
       </div>
       <div class="note-overlay" ng-if="$ctrl.note"><div style="padding: 20px;">$ctrl.note</div></div>
    `
};

const noteOverlay = angular
    .module('noteOverlay', ['ngSanitize'])
    .component('noteOverlay', NoteOverlayComponent)
    .name;

export default noteOverlay;