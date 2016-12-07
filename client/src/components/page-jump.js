class PageJumpController {
    constructor() {

    }

    onSubmit(){
        this.goToPage({pageId: this.pageNum});
    }
}

const PageJumpComponent = {
    bindings: {
        goToPage: '&'
    },
    controller: PageJumpController,
    template: `
        <form ng-submit="$ctrl.onSubmit();" class="form-inline page-jump" style="margin-bottom:20px;">
            <div class="form-group">
                <label for="pageNum">Go To Page:</label>
                <div class="input-group">
                    <input type="text" class="form-control" ng-model="$ctrl.pageNum">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="submit">
                            <span class="glyphicon glyphicon-circle-arrow-right" aria-hidden="true"></span>
                        </button>
                    </span>
                </div>
            </div>
        </form>
        `
};

const pageJump = angular
    .module('pageJump', [])
    .component('pageJump', PageJumpComponent)
    .name;

export default pageJump;