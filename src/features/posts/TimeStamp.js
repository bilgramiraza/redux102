import { parseISO, formatDistanceToNow} from "date-fns";

const TimeStamp = ({ timestamp }) => {
  let timeAgo = '';
  if(timestamp){
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  } 
  return (
    <span title="timestamp">
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}

export default TimeStamp;