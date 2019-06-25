import React from 'react'
import { Classes, Drawer, Position, Radio, RadioGroup } from "@blueprintjs/core";
import { Field, Form } from "react-final-form";

const Settings = ({ isOpen, onClose, serverStatus, onSortChange, sortedBy, sortOrder, onSortOrderChange, addPack }) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      autoFocus={true}
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      enforceFocus={true}
      hasBackdrop={true}
      position={Position.RIGHT}
      usePortal={true}
      size={Drawer.SIZE_SMALL}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <div className={`loadingState ${serverStatus}`}/>

          <RadioGroup
            label="Sort by:"
            onChange={onSortChange}
            selectedValue={sortedBy}
          >
            <Radio label="Price" value="totalPrice"/>
            <Radio label="Hours" value="playtimeForever"/>
            <Radio label="Price per hour" value="pricePerHour"/>
          </RadioGroup>

          <RadioGroup
            label="Order:"
            onChange={onSortOrderChange}
            selectedValue={sortOrder}
          >
            <Radio label="Asc" value="asc"/>
            <Radio label="Desc" value="desc"/>
          </RadioGroup>
          <Form
            onSubmit={addPack}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="packName" component="input" type="text" placeholder="Package name"/>
                <Field name="packPrice" component="input" type="number" placeholder="Package price"/>
                <button type="submit">Сохранить</button>
              </form>
            )}
          />
        </div>
      </div>
    </Drawer>
  )
};

export default Settings
