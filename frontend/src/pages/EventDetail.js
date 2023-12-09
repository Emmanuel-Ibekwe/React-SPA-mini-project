import { Suspense } from "react";
import {
  useRouteLoaderData,
  json,
  redirect,
  defer,
  Await
} from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

function EventDetail() {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {loadedEvent => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {loadedEvents => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetail;

async function loadEvent(id) {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for selected event" },
      {
        status: 500
      }
    );
  } else {
    const resData = await response.json();

    return resData.event;
  }
}

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return { isError: true, message: "Could not fetch events" };
    // throw new Response(JSON.stringify({ message: "Could not fetch events." }), {
    //   status: 500
    // }
    json({ message: "Could not fetch events." }, { status: 500 });
  } else {
    // const resData = await response.json();
    // const res = new Response("any data", { status: 201 });
    // return res;

    const resData = await response.json();

    return resData.events;
  }
}

export async function loader({ request, params }) {
  const id = params.eventId;

  return defer({
    event: loadEvent(id),
    events: loadEvents()
  });
}

export async function action({ params, request }) {
  const eventId = params.eventId;

  console.log("STARTED");

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw json({ message: "Could not delete event." }, { status: 500 });
  }

  return redirect("/events");
}