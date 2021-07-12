const requireAll = requireContext => requireContext.keys().map(requireContext)
const pubIcon = require.context('./svg/public', false, /\.svg$/)
requireAll(pubIcon)

const productIcon = require.context('./svg/product', false, /\.svg$/)
requireAll(productIcon)
