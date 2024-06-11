$(document).ready(function () {
  const isLocal = false;
  const backendUrl = isLocal ? 'http://localhost:3000' : 'https://wedsign-back-production.up.railway.app';

  $('.owl-carousel').on('click', '#iglesia', function () {
    window.open("https://maps.app.goo.gl/jkN9M2HXYjTQPL5T6", "_blank");
  });

  $('.owl-carousel').on('click', '#recepcion', function () {
    window.open("https://maps.app.goo.gl/BgJ45DQ9SWGNYoA5A", "_blank");
  });

  // RSVP
  let searchParams = new URLSearchParams(window.location.search)
  let invitationId = searchParams.get('id')
  let attendingGuests = 0;
  let attendingGuests2 = 0;

  $.get(`${backendUrl}/invitations/` + invitationId, function (data) {
    $("#inviteCustomText").html(`Hola ${data.guestName}, tu invitación es para ${data.invitedGuests} personas.`)
    attendingGuests = data.invitedGuests;
    attendingGuests2 = data.invitedGuests;
  });

  // Confirm RSVP
  $(document).on('click', '#confirmBtn', function () {
    $.ajax({
      url: `${backendUrl}/invitations/rsvp/${invitationId}?status=accepted&attendingGuests=${attendingGuests}`,
      type: 'PUT',
      // data: { attendingGuests: attendingGuests },
      success: function (data) {
        // $("#inviteCustomText").html(`Gracias por confirmar tu asistencia.`)
        $("#acceptBtn").hide();
        $("#confirmBtn").hide();
        $("#declineBtn").hide();
        $("#inviteCustomText2").html(``)
        $("#rsvp-confirmed-message").show();
      },
      error: function (xhr, status, error) {
        alert("Error: " + error)
      }
    });
  });

  $(document).on('click', '#acceptBtn', function () {
    $("#inviteCustomText").html(`¿Cuántas personas asistirán?`)
    $("#acceptBtn").hide();
    $("#confirmBtn").show();
    $("#declineBtn").hide();
    $("#inviteCustomText2").html(`<button id="decreaseGuestCount">-</button><span><span id="attendingGuests">${attendingGuests}</span>/${attendingGuests2}</span><button id="increaseGuestCount">+</button>`)
  });

  $(document).on('click', '#decreaseGuestCount', function () {
    if (attendingGuests > 1) {
      attendingGuests--
    }
    $("#attendingGuests").html(attendingGuests);
  });

  $(document).on('click', '#increaseGuestCount', function () {
    if (attendingGuests < attendingGuests2) {
      attendingGuests++
    }
    $("#attendingGuests").html(attendingGuests);
  });

  $(document).on('click', '#declineBtn', function () {
    $.ajax({
      url: `${backendUrl}/invitations/rsvp/${invitationId}?status=declined&attendingGuests=0`,
      type: 'PUT',
      // data: { attendingGuests: attendingGuests },
      success: function (data) {
        $("#acceptBtn").hide();
        $("#declineBtn").hide();
        $("#inviteCustomText").html('');
        $("#rsvp-declined-message").show();
      },
      error: function (xhr, status, error) {
        alert("Error: " + error)
      }
    });
  });
});