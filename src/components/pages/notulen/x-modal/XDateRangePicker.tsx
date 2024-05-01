import { CommonModal } from "@/components/common/common-modal/modal"
import { Button } from "@/components/common/button/button"
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';

interface XDatePickerType {
  isOpen: boolean;
  setIsOpen: any;
  rangeTanggal: any;
  setRangeTanggal: any;
}

const DateRangePicker = ({ isOpen, setIsOpen, rangeTanggal, setRangeTanggal }: XDatePickerType) => {

  const onClose = () => setIsOpen(false);

  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center pt-3">
        <DateRange
          editableDateInputs={true}
          onChange={setRangeTanggal}
          // onChange={(item: any) => setRangeTanggal([item.selection])}  
          moveRangeOnFirstSelection={false}
          ranges={rangeTanggal}
        />
        <Button
          variant="xl"
          className="button-container mb-2 mt-5"
          rounded
          onClick={() => onClose()}
        >
          <div className="flex justify-center items-center text-white">
            <span className="button-text">Pilih</span>
          </div>
        </Button>
        <Button
          variant="xl"
          className="button-container mb-2"
          rounded
          type='secondary'
          onClick={() => onClose()}
        >
          <div className="flex justify-center items-center text-dark-xl">
            <span className="button-text">Batal</span>
          </div>
        </Button>
      </div>
    </CommonModal>
  )
}

export default DateRangePicker