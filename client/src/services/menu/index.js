import apiClient from 'services/axios'
import { cloneDeep, union } from 'lodash'

// nomalise string nbsp
function normalise(array) {
  array.forEach(element => {
    element.icon = element.icon?.replace(/\u00a0/g, ' ')
    element.role_ids = element.role_ids === '' ? [] : element.role_ids.split(',')
    element.key = element.menu_id
    if (element.category) delete element.role_ids
  })
  return array
}

// convert to nested
function convert(array) {
  normalise(array)
  return createMenuTree(array)
}

const createMenuTree = array => {
  const hashTable = {}
  array.forEach(menu => (hashTable[menu.menu_id] = { ...menu })) // eslint-disable-line
  const dataTree = []
  array.forEach(menu => {
    const currentMenu = hashTable[menu.menu_id]
    if (menu.parent_id) {
      const parentMenu = hashTable[menu.parent_id]
      if (!parentMenu) return
      parentMenu.children = parentMenu.children || []
      parentMenu.children.push(currentMenu)
      parentMenu.role_ids = union(parentMenu.role_ids, currentMenu.role_ids)
    } else dataTree.push(currentMenu)
  })
  return dataTree
}

export default async function LoadMenuData(source) {
  return apiClient
    .get('/auth/menu', {
      headers: { source },
    })
    .then(response => {
      if (response) {
        const menuData = response.data.data
        return [normalise(cloneDeep(menuData)), convert(cloneDeep(menuData))]
      }
      return false
    })
    .catch(err => console.log(err))
}
export { createMenuTree }
