import React from "react";
import ReactSelect from "react-select";

const PlanProcedureItem = ({ procedure, users, procedureId, assignUsers, selectedUsers }) => {
    const selectedPlanUsers = selectedUsers?.[procedureId] ?? [];
    // const [selectedUsers, setSelectedUsers] = useState(null);

    const handleAssignUserToProcedure = (e) => {
        assignUsers(procedureId, e);
        // TODO: Remove console.log and add missing logic
        console.log(e);
    };

    return (
        <div className="py-2">
            <div>
                {procedure.procedureTitle}
            </div>

            <ReactSelect
                className="mt-2"
                placeholder="Select User to Assign"
                isMulti={true}
                options={users}
                value={selectedPlanUsers}
                onChange={(e) => handleAssignUserToProcedure(e)}
            />
        </div>
    );
};

export default PlanProcedureItem;
