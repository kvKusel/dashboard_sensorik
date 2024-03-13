import Dropdown from 'react-bootstrap/Dropdown';

function DropdownButton({ trees, onSelectTree }) {
  
  return (
    <Dropdown className='dropdown-center'>
      <Dropdown.Toggle className='text-center lead fs-4' variant="success" id="dropdown-basic" style={{ width: '100%', borderRadius:1}}>
        Baum wählen
      </Dropdown.Toggle>

      <Dropdown.Menu className='w-75'>
      {trees.map(tree => (
        <Dropdown.Item key={tree.id} onClick={() => onSelectTree(tree)}>
          {tree.name}
        </Dropdown.Item>
      ))}
        {/* <Dropdown.Item type='button' className='fs-3'>Pleiner Mostbirne</Dropdown.Item>
        <Dropdown.Item type='button' className='fs-3'>Cox Orangenrenette</Dropdown.Item>
        <Dropdown.Item type='button' className='fs-3'>Something else</Dropdown.Item> */}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownButton;