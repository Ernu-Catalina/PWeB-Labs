import socket
import sys
import re
import os
import hashlib
import requests
from urllib.parse import urlencode
from bs4 import BeautifulSoup  # Import BeautifulSoup for HTML parsing

CACHE_DIR = os.path.expanduser("~/.go2web_cache")
HEADERS = {
    'User-Agent': 'go2web/1.0',
    'Accept': 'text/html,application/xhtml+xml,application/json',
    'Connection': 'close'
}

def print_help():
    """Show help message."""
    print("Usage: go2web [options]\n")
    print("Options:")
    print("  -u <URL>         Make an HTTP request to the specified URL and print the response")
    print("  -s <search-term> Make an HTTP request to search the term and print top 10 results")
    print("  -h               Show this help")


def fetch_url(url):
    """Fetch the URL and return the body of the response."""
    if not url.startswith("http"):
        url = "http://" + url
    url_parts = re.match(r"https?://([^/]+)(/.*)?", url)
    if not url_parts:
        print(f"Invalid URL: {url}")
        sys.exit(1)
    host, path = url_parts.groups()
    path = path or "/"
    response = requests.get(url, headers=HEADERS)
    return response.text


def search_term(term):
    """Search the given term using Bing and print the top 10 results."""
    query = '+'.join(term.split())  # Convert the search term to a query string.
    url = f"https://www.bing.com/search?q={query}"

    # Make the request to Bing search
    response = requests.get(url, headers=HEADERS)

    # Check if the request was successful
    print(f"Response Status Code: {response.status_code}")  # Debugging line
    if response.status_code == 200:
        print("Response Text (First 500 characters):")  # Debugging line
        print(response.text[:500])  # Print the first 500 characters of the response for inspection
        
        # Parse the HTML page using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all the links to search results (within <a> tags)
        search_results = soup.find_all('a', href=True)

        # Extract only the URLs that are likely to be valid search result links (excluding Microsoft redirect links)
        links = []
        for result in search_results:
            href = result.get('href')
            if href and 'http' in href and 'microsoft' not in href:  # Exclude Microsoft links
                links.append(href)

        # Remove duplicate links by converting to a set, then print the top 10 unique links
        unique_links = sorted(set(links))[:10]
        for link in unique_links:
            print(link)
    else:
        print(f"Error: Unable to fetch search results. Status code: {response.status_code}")
        print(f"Error Message: {response.text}")


def main():
    """Main function to handle the command-line arguments."""
    if len(sys.argv) < 2 or sys.argv[1] == "-h":
        print_help()
        return

    option, *args = sys.argv[1:]
    if option == "-u" and args:
        url = args[0]
        print(fetch_url(url))
    elif option == "-s" and args:
        term = " ".join(args)
        search_term(term)
    else:
        print_help()


if __name__ == "__main__":
    main()
