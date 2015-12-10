angular.module('sc.directives').directive('circleImage', circleImage);

function circleImage() {
    return {
        restrict: 'EA',
        template: template,
        replace : false,
        scope: {
            width: '@width',
            height: '@height',
            srcImage : '@'
        }
    };
}

var template = "";
    template +=
        "<figure style='width:{{width}};height:{{height}}' class='img-circle'>" +
         "<img ng-src={{srcImage}}>" +
        "</figure>";