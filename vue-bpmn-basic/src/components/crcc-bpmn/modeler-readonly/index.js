import inherits from 'inherits'

import customTranslateModule from '../modeler-enhance/translate'

import Modeler from 'bpmn-js/lib/NavigatedViewer' 
export default function ReadonlyModeler(options) {
    Modeler.call(this, options)
    this._customElements = []
}

inherits(ReadonlyModeler, Modeler)

ReadonlyModeler.prototype._modules = [].concat(
    ReadonlyModeler.prototype._modules, [
        // 汉化处理
        customTranslateModule,
    ]
)