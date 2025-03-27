import Dropdown from "react-bootstrap/Dropdown";

function DropdownButton({ trees, onSelectTree }) {
  const treesWithIdGreaterThanOrEqualTo6 = trees.filter((tree) => tree.id >= 6);
  const treesWithIdLessThan6 = trees.filter((tree) => tree.id < 6);

  return (
    <Dropdown className="dropdown-center ">
      <Dropdown.Toggle
        className="text-center lead fs-5 px-0 fw-normal rounded-3"
        variant="success"
        id="dropdown-basic"
        style={{
          width: "100%",
          borderRadius: 1,
          backgroundImage: "linear-gradient(0deg, #1A2146 0%, #1F2C61 100%)",
          borderColor: "#1A2146",
        }}
      >
        Ansicht wählen
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-75">
        <div className="p-1 ps-3 fw-bold">Übersicht:</div>

        {treesWithIdGreaterThanOrEqualTo6.map((tree) => (
          <div key={tree.id}>
            <Dropdown.Item
              className=""
              onClick={() => onSelectTree(tree)}
              style={{ whiteSpace: "normal" }}
            >
              {tree.name}
            </Dropdown.Item>
            <hr style={{ margin: "0", borderColor: "gray" }} />
          </div>
        ))}

        <div className="p-1 ps-3 pt-2 fw-bold">Detailansicht Bäume:</div>
        {treesWithIdLessThan6.map((tree, index) => (
          <div key={tree.id}>
            <Dropdown.Item
              onClick={() => onSelectTree(tree)}
              style={{ whiteSpace: "normal" }}
            >
              {tree.name}
            </Dropdown.Item>
            {index !== treesWithIdLessThan6.length - 1 && (
              <hr style={{ margin: "0", borderColor: "gray" }} />
            )}
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownButton;
