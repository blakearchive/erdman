class ErdmanController {

    /**@ngInject*/
    constructor(ErdmanDataService){
        ErdmanDataService.getPages().then(pages => this.pages = pages)
    }
}

export default ErdmanController