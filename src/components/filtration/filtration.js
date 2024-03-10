import React from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import './filtration.sass';
import {TextField} from "@mui/material"; // Импортируйте стили из файла SCSS

const FilterBlock = ({
                         mods,
                         valueFilter,
                         selectMod,
                         onChangeMod,
                         onChangeValueFilter,
                         filterProducts,
                         resetFiltration
                     }) => {
    return (
        <div className="filtrationBlock">
            <div className="title">
                <p>Настроки фильтрации: </p>
            </div>
            <div className="buttonGroup">
                <Button
                    className={selectMod === mods[0] ? "activeBtn" : ""}
                    variant={"outlined"}
                    // color="primary"
                    onClick={() => onChangeMod(mods[0])}
                >
                    Brand
                </Button>
                <Button
                    className={selectMod === mods[1] ? "activeBtn" : ""}
                    variant="outlined"
                    // color="primary"
                    onClick={() => onChangeMod(mods[1])}
                >
                    Price
                </Button>
                <Button
                    className={selectMod === mods[2] ? "activeBtn" : ""}
                    variant="outlined"
                    // color="primary"
                    onClick={() => onChangeMod(mods[2])}
                >
                    Product
                </Button>
            </div>


            <div className="inputField">
                <TextField
                    disabled={selectMod === null ? true : false}
                    size="small"
                    label="Фильтр"
                    id="outlined-basic"
                    variant="outlined"
                    value={valueFilter}
                    onChange={(e) => onChangeValueFilter(e.target.value)}
                    type="text"
                    // className="inputField"
                />
            </div>


            <Button
                disabled={selectMod === null ? true : false}
                variant="contained"
                // color="secondary"
                onClick={() => filterProducts(selectMod, valueFilter)}
                className="applyButton"
            >
                Применить фильтрацию
            </Button>

            <Button
                variant="contained"
                // color="secondary"
                onClick={() => resetFiltration()}
                className="resetButton"
            >
                Сбросить фильтрацию
            </Button>

        </div>
    );
};

export default FilterBlock;
