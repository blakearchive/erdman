class SearchFormController {
    constructor() {
        this.query = '';
    }

    onSubmit(){
        this.onSearch({query: this.query});
    }

    static create() {
        return new SearchFormController();
    }

}

const SearchFormComponent = {
    bindings: {
        onSearch: '&'
    },
    controller: SearchFormController.create,
    template: `
        <form class="navbar-form navbar-right" role="search" ng-submit="$ctrl.onSubmit();">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Search" ng-model="$ctrl.query">
            </div>
            <button type="submit" class="btn btn-default">Search</button>
        </form>
        `
};

const searchForm = angular
    .module('searchForm', [])
    .component('searchForm', SearchFormComponent)
    .name;

export default searchForm;