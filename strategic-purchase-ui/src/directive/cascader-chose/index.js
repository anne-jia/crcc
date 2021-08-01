function cascaderChose(el, binding) {
    let tagNameLabel=$(el).parent().prev()[0].tagName;
    if(el.className!==binding.value){
        if(tagNameLabel==='LABEL'){
            $(el).parent().prev().hide()
        }
    }
  }
const cascaderChoseHide= Vue.directive('cascaderChoseHide',{
    inserted(el, binding) {
        cascaderChose(el, binding)
      },
      update(el, binding) {
        cascaderChose(el, binding)
      }
})
export default cascaderChoseHide