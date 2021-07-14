import inherits from 'inherits'
// import Viewer from "bpmn-js/lib/Viewer";

import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";

import customTranslateModule from '../modeler-enhance/translate'

import Modeler from 'bpmn-js/lib/NavigatedViewer' 

export default function ModelerViewer(options) {
    Modeler.call(this, options)
    this._customElements = []
}

inherits(ModelerViewer, Modeler)

ModelerViewer.prototype._modules = [].concat(
    ModelerViewer.prototype._modules, [
        // 汉化处理
        customTranslateModule,
        ZoomScrollModule,
        MoveCanvasModule
    ]
)

export { ModelerViewer, Modeler };