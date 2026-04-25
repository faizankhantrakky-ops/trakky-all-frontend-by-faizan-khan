import os
import requests
from django.db import transaction
from .models import Appointment
from .models import CurrentUseInventory  # adjust if needed


def send_appointment_notification(appointment: Appointment):
    """
    Sends a POST request to AppointmentNotification API.
    """

    data = {
        "Appointment": appointment.id,
    }

    base_url = os.environ.get("URL_NOTIFICATION")
    if not base_url:
        return

    notification_url = f"{base_url}/salonvendor/appointment-notifications/"

    try:
        response = requests.post(notification_url, json=data, timeout=(2, 3))
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Failed to send appointment notification: {e}")


def update_product_consumption(appointment: Appointment):
    """
    Updates inventory based on appointment.product_details
    """

    if not appointment.product_details:
        return

    product_ids = []
    consumption_by_id = {}

    for product in appointment.product_details:
        try:
            product_id = product["id"]
            per_use_consumption = product["per_use_consumption"]
            total_use_times = product["total_use_times"]
        except KeyError as e:
            print(f"KeyError: Missing key in product details - {e}")
            continue

        total_consumption = per_use_consumption * total_use_times
        product_ids.append(product_id)
        consumption_by_id[product_id] = (
            consumption_by_id.get(product_id, 0) + total_consumption
        )

    if not product_ids:
        return

    inventory_map = CurrentUseInventory.objects.in_bulk(product_ids)

    to_update = []
    for product_id, total_consumption in consumption_by_id.items():
        current_inventory = inventory_map.get(product_id)
        if not current_inventory:
            print(f"Product with ID {product_id} does not exist.")
            continue

        current_inventory.remaining_quantity -= total_consumption
        to_update.append(current_inventory)

    if to_update:
        CurrentUseInventory.objects.bulk_update(
            to_update, ["remaining_quantity"]
        )
