export default eventHandler(async (event) => {
    const sections = await queryCollectionSearchSections(event, 'docs')
    return sections
  })
  