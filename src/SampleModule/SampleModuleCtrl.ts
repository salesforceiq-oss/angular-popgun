export class SampleModuleCtrl {

  constructor($scope, $element, AngularPopgunSrvc) {
    AngularPopgunSrvc.init($scope, $element[0]);
  }
}
