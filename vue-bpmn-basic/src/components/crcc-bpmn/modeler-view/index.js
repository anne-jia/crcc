import inherits from 'inherits'


import customTranslateModule from '../modeler-enhance/translate'

import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer' 
import ModelingModule from 'bpmn-js/lib/features/modeling'
export default function ModelerViewer(options) {
    NavigatedViewer.call(this, options)
    this._customElements = []
}

inherits(ModelerViewer, NavigatedViewer)

ModelerViewer.prototype._modules = [].concat(
    ModelerViewer.prototype._modules, [
        // 汉化处理
        customTranslateModule,
        ModelingModule,
    
    ]
)

export { ModelerViewer, NavigatedViewer };