import jQuery from 'jquery';
import Page from './models';

jQuery.ajaxSettings.traditional = true;

class ErdmanDataService {
    constructor($http){
        this.$http = $http;
        this.apiBase = 'http://localhost:8002';
    }
    getPages() {
        let url = this.apiBase + '/api/pages';
        return this.$http.get(url).then(response => response.data);
    }
}

ErdmanDataService.$inject = ['$http'];

export default ErdmanDataService;