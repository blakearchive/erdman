import controller from './reader.controller';

const ReaderComponent = {
    bindings: {
        pages: '<'
    },
    controller,
    template:`
    <div id="reader">
        <div ng-repeat="page in $ctrl.pages" class="page">
            {{ page.contents }}
        </div>
    </div>
    `
}

export default ReaderComponent;