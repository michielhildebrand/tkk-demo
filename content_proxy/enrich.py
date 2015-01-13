#!/usr/bin/python

import argparse
from enrich_video import update_seed

def main():
    parser = argparse.ArgumentParser(description='Fetch LinkedTV videos')
    parser.add_argument('-v', '--video', help='Video identifier',required=False)
    parser.add_argument('-s', '--seed', help='Seed video list',required=True)
    parser.add_argument('-p', '--publisher', help='Publisher (rbb,sv)',required=True)
    parser.add_argument('-o', '--output', help='Output file',required=True)
    args = parser.parse_args()
    
    seed = args.seed
    video = args.video
    output = args.output
    publisher = args.publisher

    update_seed(seed, video, output, publisher)

main()