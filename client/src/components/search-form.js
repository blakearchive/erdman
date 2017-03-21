class SearchFormController {
    constructor() {
        this.query = '';
    }

    onSubmit(){
        console.log('submitting');
        this.query = encodeURIComponent(this.query);
        this.onSearch({query: this.query});
    }
}

const SearchFormComponent = {
    bindings: {
        onSearch: '&'
    },
    controller: SearchFormController,
    template: `

        <form class="navbar-form navbar-right" role="search" ng-submit="$ctrl.onSubmit();">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Search" ng-model="$ctrl.query">
                <span class="input-group-btn">
                    <button class="btn btn-default" type="submit">
                        <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
                    </button>
                </span>
            </div>
        </form>
        `
};

const searchForm = angular
    .module('searchForm', [])
    .component('searchForm', SearchFormComponent)
    .name;

export default searchForm;