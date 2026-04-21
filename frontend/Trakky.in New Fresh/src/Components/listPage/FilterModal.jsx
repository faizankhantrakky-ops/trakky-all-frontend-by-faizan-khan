import React, { useEffect } from "react";
import { useState } from "react";
import "./filtermodal.css";
import crossImg from "../../Assets/images/icons/crossIcon_svg.svg";

const FilterModal = ({
  onClose,
  selectedFilters,
  applyFilters,
  setSelectedFilters,
  clearAllQueryParams,
  filterOptionValue,
  filterOptions,
  activeFilterSection,
  setActiveFilterSection,
  setQuickOptions,
  QuickOptions,
}) => {
  const handleFilterChange = (
    filterName,
    optionValue,
    name,
    checked,
    id = null
  ) => {
    if (
      filterName == "Service_Category" ||
      filterName == "Salon_Category" ||
      filterName == "Price_Range" ||
      filterName == "Amenities"
    ) {
      if (checked) {
        setSelectedFilters((prevState) => ({
          ...prevState,
          [filterName]: [
            ...(prevState[filterName] || []),
            { value: optionValue, name: name },
          ],
        }));
      } else {
        setSelectedFilters((prevState) => ({
          ...prevState,
          [filterName]: [
            ...(prevState[filterName] || []).filter(
              (item) => item.value !== optionValue
            ),
          ],
        }));
      }
    }

    if (filterName == "Area") {
      setSelectedFilters((prevState) => ({
        ...prevState,
        [filterName]: [{ value: optionValue, name: name }],
      }));
    }

    if (
      filterName === "Distance" ||
      filterName === "Score" ||
      filterName === "Discount"
    ) {
      if (optionValue === "7_9") {
        setSelectedFilters((prevState) => ({
          ...prevState,
          Quick_Selection: [
            ...(prevState["Quick_Selection"] || []),
            { value: optionValue, name: name },
          ],
          Score: [{ value: optionValue, name: name }],
        }));

        // const [QuickOptions , setQuickOptions] = useState([
        //   {
        //     value: "within_5",
        //     name: "Within 5km",
        //     type: "checkbox",
        //   },
        //   {
        //     value: "7_9",
        //     name: "Score 7-9",
        //     type: "checkbox",
        //   },
        //   {
        //     value: "50_up",
        //     name: "50% off or more",
        //     type: "checkbox",
        //   },
        // ]);
        // remove option from quick options

        setQuickOptions((prevState) => [
          ...prevState.filter((item) => item.value !== "7_9"),
        ]);

        return;
      }
      if (optionValue === "50_up") {
        setSelectedFilters((prevState) => ({
          ...prevState,
          Quick_Selection: [
            ...(prevState["Quick_Selection"] || []).filter(
              (item) => item.value !== "50_up"
            ),
            {
              value: optionValue,
              name: name,
            },
          ],
          Discount: [{ value: optionValue, name: name }],
        }));

        setQuickOptions((prevState) => [
          ...prevState.filter((item) => item.value !== "50_up"),
        ]);

        return;
      }
      if (optionValue === "within_5") {
        setSelectedFilters((prevState) => ({
          ...prevState,
          Quick_Selection: [
            ...(prevState["Quick_Selection"] || []).filter(
              (item) => item.value !== "within_5"
            ),
            {
              value: optionValue,
              name: name,
            },
          ],
          Distance: [{ value: optionValue, name: name }],
        }));

        setQuickOptions((prevState) => [
          ...prevState.filter((item) => item.value !== "within_5"),
        ]);

        return;
      }

      if (filterName == "Distance") {
        setSelectedFilters((prevState) => ({
          ...prevState,
          Distance: [{ value: optionValue, name: name }],
          Quick_Selection: [
            ...(prevState["Quick_Selection"] || []).filter(
              (item) => item.value !== "within_5"
            ),
          ],
        }));
      } else if (filterName == "Score") {
        setSelectedFilters((prevState) => ({
          ...prevState,
          Score: [{ value: optionValue, name: name }],
          Quick_Selection: [
            ...(prevState["Quick_Selection"] || []).filter(
              (item) => item.value !== "7_9"
            ),
          ],
        }));
      } else if (filterName == "Discount") {
        setSelectedFilters((prevState) => ({
          ...prevState,
          Discount: [{ value: optionValue, name: name }],
          Quick_Selection: [
            ...(prevState["Quick_Selection"] || []).filter(
              (item) => item.value !== "50_up"
            ),
          ],
        }));
      }
    }

    if (filterName == "Quick_Selection") {
      if (
        optionValue == "cost_low_high" ||
        optionValue == "cost_high_low" ||
        optionValue == "popularity_high_low" ||
        optionValue == "popularity_low_high"
      ) {
        setSelectedFilters((prevState) => ({
          ...prevState,
          Quick_Selection: [
            ...(prevState["Quick_Selection"] || []).filter(
              (item) => item.id !== id
            ),
            { value: optionValue, name: name, id: id },
          ],
        }));
      } else {
        if (checked) {
          if (optionValue == "within_5") {
            setSelectedFilters((prevState) => ({
              ...prevState,
              Quick_Selection: [
                ...(prevState["Quick_Selection"] || []).filter(
                  (item) => item.value !== optionValue
                ),
                { value: optionValue, name: name },
              ],
              Distance: [{ value: optionValue, name: name }],
            }));

            setQuickOptions((prevState) => [
              ...prevState.filter((item) => item.value !== "within_5"),
            ]);
          } else if (optionValue == "7_9") {
            setSelectedFilters((prevState) => ({
              ...prevState,
              Quick_Selection: [
                ...(prevState["Quick_Selection"] || []).filter(
                  (item) => item.value !== optionValue
                ),
                { value: optionValue, name: name },
              ],
              Score: [{ value: optionValue, name: name }],
            }));

            setQuickOptions((prevState) => [
              ...prevState.filter((item) => item.value !== "7_9"),
            ]);
          } else if (optionValue == "50_up") {
            setSelectedFilters((prevState) => ({
              ...prevState,
              Quick_Selection: [
                ...(prevState["Quick_Selection"] || []).filter(
                  (item) => item.value !== optionValue
                ),
                { value: optionValue, name: name },
              ],
              Discount: [{ value: optionValue, name: name }],
            }));

            setQuickOptions((prevState) => [
              ...prevState.filter((item) => item.value !== "50_up"),
            ]);
          }
        } else {
          if (optionValue == "within_5") {
            setSelectedFilters((prevState) => ({
              ...prevState,
              Quick_Selection: [
                ...(prevState["Quick_Selection"] || []).filter(
                  (item) => item.value !== optionValue
                ),
              ],
              Distance: [],
            }));

            setQuickOptions((prevState) => [
              ...prevState,
              {
                value: "within_5",
                name: "Within 5km",
                type: "checkbox",
              },
            ]);
          } else if (optionValue == "7_9") {
            setSelectedFilters((prevState) => ({
              ...prevState,
              Quick_Selection: [
                ...(prevState["Quick_Selection"] || []).filter(
                  (item) => item.value !== optionValue
                ),
              ],
              Score: [],
            }));

            setQuickOptions((prevState) => [
              ...prevState,
              {
                value: "7_9",
                name: "Score 7-9",
                type: "checkbox",
              },
            ]);
          } else if (optionValue == "50_up") {
            setSelectedFilters((prevState) => ({
              ...prevState,
              Quick_Selection: [
                ...(prevState["Quick_Selection"] || []).filter(
                  (item) => item.value !== optionValue
                ),
              ],
              Discount: [],
            }));

            setQuickOptions((prevState) => [
              ...prevState,
              {
                value: "50_up",
                name: "50% off or more",
                type: "checkbox",
              },
            ]);
          }
        }
      }
    }
  };

  return (
    <div className="N-filter-modal-container">
      <div className="N-filter-m-header">
        <h3>Filter</h3>
        <img
          src={crossImg}
          alt="Close Button"
          onClick={() => {
            onClose();
          }}
        />
      </div>
      <div className="N-filter-option-n-value">
        <div className="N-filter-option-cat">
          {filterOptions.map((item, index) => (
            <div
              key={index}
              className={`N-filter-option-cat-item relative cursor-pointer  ${
                activeFilterSection == item.value && "active"
              }`}
              onClick={() => {
                setActiveFilterSection(item.value);
              }}
            >
              {activeFilterSection == item.value && (
                <span className="N-filter-active-option"></span>
              )}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <div className="N-filter-options">
          {filterOptionValue?.[activeFilterSection]?.map((item, index) => (
            <div className="N-filter-option-item" key={index}>
              {item.type === "checkbox" ? (
                <div className="N-filter-option-item-checkbox  cursor-pointer">
                  <input
                    type="checkbox"
                    id={item.value}
                    checked={selectedFilters?.[activeFilterSection]?.some(
                      (filter) => filter.value === item.value
                    )}
                    onChange={(e) =>
                      handleFilterChange(
                        activeFilterSection,
                        item.value,
                        item.name,
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor={item.value} className=" cursor-pointer">
                    {item.name}
                  </label>
                </div>
              ) : (
                <div className="N-filter-option-item-radio cursor-pointer">
                  <input
                    type="radio"
                    id={item.value}
                    name={item.id}
                    checked={selectedFilters?.[activeFilterSection]?.some(
                      (filter) => filter.value === item.value
                    )}
                    onChange={(e) =>
                      handleFilterChange(
                        activeFilterSection,
                        item.value,
                        item.name,
                        true,
                        item.id
                      )
                    }
                  />
                  <label htmlFor={item.value} className=" cursor-pointer">
                    {item.name}
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="N-filter-reset-submit-btn">
        <button
          className="reset"
          onClick={() => {
            setSelectedFilters({});
            clearAllQueryParams();
            onClose();
          }}
        >
          Reset
        </button>
        <button
          className="submit"
          onClick={() => {
            applyFilters();
            onClose();
          }}
          // onClick={applyFilters}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
