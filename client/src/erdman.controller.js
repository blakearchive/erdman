class ErdmanController {

    /**@ngInject*/
    constructor(ErdmanDataService){
        ErdmanDataService.getPages().then(response => this.pages = response)
    }
}

ErdmanController.$inject = ['ErdmanDataService'];

export default ErdmanController