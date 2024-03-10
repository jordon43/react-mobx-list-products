import React from 'react';
import Button from '@mui/material/Button';
import './filtration.sass';
import {TextField} from "@mui/material";

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
                <p>Настройка фильтрации: </p>
            </div>
            <div className="buttonGroup">
                <Button
                    className={selectMod === mods[0] ? "activeBtn" : ""}
                    variant={"outlined"}
                    onClick={() => onChangeMod(mods[0])}
                >
                    Бренд
                </Button>
                <Button
                    className={selectMod === mods[1] ? "activeBtn" : ""}
                    variant="outlined"
                    onClick={() => onChangeMod(mods[1])}
                >
                    Цена
                </Button>
                <Button
                    className={selectMod === mods[2] ? "activeBtn" : ""}
                    variant="outlined"
                    onClick={() => onChangeMod(mods[2])}
                >
                    Название
                </Button>
            </div>


            <div className="inputField">
                <TextField
                    disabled={selectMod === null ? true : false}
                    size="small"
                    label="Введите значение"
                    id="outlined-basic"
                    variant="outlined"
                    value={valueFilter}
                    onChange={(e) => onChangeValueFilter(e.target.value)}
                    type="text"
                />
            </div>


            <Button
                disabled={selectMod === null ? true : false}
                variant="contained"
                onClick={() => filterProducts(selectMod, valueFilter)}
                className="applyButton"
            >
                Применить фильтрацию
            </Button>

            <Button
                variant="contained"
                onClick={() => resetFiltration()}
                className="resetButton"
            >
                Сбросить фильтрацию
            </Button>

        </div>
    );
};

export default FilterBlock;
