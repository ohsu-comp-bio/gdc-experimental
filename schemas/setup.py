#!/usr/bin/env python

from setuptools import setup

setup(name='cccschema',
      version='1.0',
      description='CCC DMS Schemas',
      author='Brian Walsh',
      author_email='walsbr@ohsu.edu',
      include_package_data=True,
      url='https://github.com/ohsu-computational-biology/gdc-experimental/schemas',  # nopep8
      packages=['cccschema'],
      install_requires=[
          'jsonschema',
      ],
      )
