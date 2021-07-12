import ParticipantSetting from './src/index'

ParticipantSetting.install = function (Vue) {
    Vue.component(ParticipantSetting.name, ParticipantSetting);
}

export default ParticipantSetting;