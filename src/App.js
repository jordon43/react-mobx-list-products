import "./styles/App.css";
import {useEffect, useMemo, useState} from "react";
import {observer} from "mobx-react-lite";
import ProductsStore from "./store/products-store";
import ProductsList from "./components/productsList/productsList";
import {Box, Pagination} from "@mui/material";
import Filtration from "./components/filtration/filtration";

const App = observer(() => {
    const {
        productsId,
        productsInfo,
        countAllProducts,
        resetProducts,
        getProductsId,
        getItems,
        filterProducts,
        countFilteredProducts
    } = ProductsStore;


    const mods = ["brand", "price", "product"];
    const [selectMod, setSelectMod] = useState(null);
    const [valueFilter, setValueFilter] = useState("");
    const [offset, setOffset] = useState(0);
    const [filtered, setFiltered] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(50);

    const countPage =
        useMemo(() => {
            if (filtered) {
                return Math.floor(countFilteredProducts / limit)
            } else {
                return Math.floor(countAllProducts / limit)
            }
        }, [offset, filtered, countFilteredProducts, countAllProducts]);

    const onChangeMod = (a) => {
        setSelectMod(a)
    }

    const onChangeValueFilter = (a) => {
        setValueFilter(a)
    }

    const filter = (mod, value) => {
        setFiltered(true)
        setCurrentPage(1)
        filterProducts(mod, value, selectMod)
        setOffset(0)
    }
    const resetFiltration = () => {
        setFiltered(false)
        setSelectMod(null)
        setCurrentPage(1)
        setOffset(0)
        if (filtered) resetProducts()
    }

    useEffect(() => {
        getProductsId();
    }, []);

    useEffect(() => {
        if (selectMod === null) {
            getProductsId(offset, limit);
        } else {

        }
    }, [offset, selectMod]);

    useEffect(() => {
        if (productsId) {
            getItems();
        }
    }, [productsId]);

    return (
        <div className="App">
            <Filtration
                selectMod={selectMod}
                mods={mods}
                valueFilter={valueFilter}
                onChangeMod={onChangeMod}
                onChangeValueFilter={onChangeValueFilter}
                filterProducts={filter}
                resetFiltration={resetFiltration}
            >
            </Filtration>

            {(countPage >= 1) &&

                <div className="pagination">
                    <Box display="flex" justifyContent="center">
                        {countPage > 1 && (
                            <Pagination
                                count={countPage}
                                page={currentPage}
                                onChange={(event, value) => {
                                    if (!filtered) resetProducts()
                                    setCurrentPage(value);
                                    setOffset(limit * (value - 1))
                                }}
                                variant="outlined"
                                shape="rounded"
                            />
                        )}
                    </Box>
                </div>

            }

            {(productsInfo !== null) ?
                <ProductsList
                    productsInfo={!filtered
                        ? productsInfo
                        : productsInfo.slice(offset, offset + limit)}
                ></ProductsList>
                :
                <div className="download">
                    <p>Загрузка.....</p>
                </div>
            }

            {(productsInfo !== null && countPage > 1) &&
                <div className="pagination">
                    <Box display="flex" justifyContent="center">
                        <Pagination
                            count={countPage}
                            page={currentPage}
                            onChange={(event, value) => {
                                //resetProducts()
                                setCurrentPage(value);
                                setOffset(limit * (value - 1))
                            }}
                            variant="outlined"
                            shape="rounded"
                        />
                    </Box>
                </div>
            }

        </div>
    );
});

export default App;
