interface type {
  selected: any,
  setSelected: any,
  item: any,
  type?: string,
}

const NavButton = ({ selected, setSelected, item, type }: type) => {
  return (
    <div>
      <ul className="flex bg-[#FelF3FE] border border-t-gray-100 shadow-md nav-button p-1 rounded-full font-Axiata-Medium">
        {item?.map((el: any, i: number) => (
          <div key={i} className="nav-btn">
            <li className={`${selected == el.value ? 'tabActive' : 'tabNonActive'} flex items-center justify-center font-Axiata-Medium md:text-md text-sm p-1 text-center cursor-pointer`} onClick={() => setSelected(el.value)}>{el.name}</li>
          </div>
        ))}
      </ul>
    </div >
  )
}

export default NavButton